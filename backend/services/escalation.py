from database import Session
from datetime import datetime
from models.models import Complaint, Official, EscalationLog

def check_and_escalate_overdue_complaints(db: Session):
    """
    Scans open complaints, checks if they breached deadlines,
    and escalates them to the next administrative tier.
    """
    now = datetime.utcnow()
    
    # Query all complaints that are not resolved or archived and are past their deadline
    overdue_complaints = db.query(Complaint).filter(
        Complaint.status.notin_(["RESOLVED", "ARCHIVED"]),
        Complaint.deadline_at < now
    ).all()
    
    escalations_performed = 0
    
    for c in overdue_complaints:
        # 1. Set overdue flags
        if not c.is_overdue:
            c.is_overdue = True
            c.star_rating = min(5, c.star_rating + 1) # Auto-bump star priority
            
        # 2. Check how long overdue it is and escalate if needed
        # We perform escalation if it hasn't been escalated recently
        current_tier = c.assigned_tier
        if current_tier < 4: # Can escalate up to Tier 4
            next_tier = current_tier + 1
            
            # Find next tier official
            next_official = None
            if next_tier == 2:
                # District Collector
                next_official = db.query(Official).filter(Official.role == "COLLECTOR").first()
            elif next_tier == 3:
                # MP
                next_official = db.query(Official).filter(Official.role == "MP").first()
            elif next_tier == 4:
                # Ministry
                next_official = db.query(Official).filter(Official.role == "MINISTRY").first()
                
            if next_official:
                # Log the escalation
                log = EscalationLog(
                    complaint_id=c.id,
                    from_tier=current_tier,
                    to_tier=next_tier,
                    from_official_id=c.assigned_to,
                    to_official_id=next_official.id,
                    reason=f"Deadline exceeded by {(now - c.deadline_at).days} days. Auto-escalated to tier {next_tier}."
                )
                db.add(log)
                
                # Penalize previous official's accountability score
                if c.assigned_to:
                    prev_official = db.query(Official).filter(Official.id == c.assigned_to).first()
                    if prev_official:
                        prev_official.accountability_score = max(0, prev_official.accountability_score - 10)
                
                # Reassign
                c.assigned_to = next_official.id
                c.assigned_tier = next_tier
                c.status = "ESCALATED"
                c.escalation_count += 1
                
                # Reset deadline with shorter windows for escalations
                c.deadline_at = now + (c.deadline_at - c.assigned_at) / 2 # Halve response window
                c.assigned_at = now
                
                escalations_performed += 1
                
    db.commit()
    return escalations_performed
