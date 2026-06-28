from database import Session
from models.models import Official, Complaint

def route_complaint_to_official(complaint: Complaint, db: Session) -> tuple[str, int]:
    """
    Assign complaint to the correct official and tier.
    Returns: (assigned_official_id, assigned_tier)
    """
    # Tier 4 - Ministry (Emergency/Catastrophic)
    if complaint.criticality_level == "CATASTROPHIC":
        ministry_official = db.query(Official).filter(Official.role == "MINISTRY").first()
        if ministry_official:
            return ministry_official.id, 4
            
    # Tier 3 - MP level
    # Since we don't have budget details on initial file, we base it on criticality & description keyword
    is_mp_scope = (
        complaint.criticality_level == "CRITICAL" and
        any(k in (complaint.text_content or "").lower() for k in ["highway", "dam", "bridge", "constituency"])
    )
    if is_mp_scope:
        mp_official = db.query(Official).filter(Official.role == "MP").first()
        if mp_official:
            return mp_official.id, 3
            
    # Tier 2 - District Collector level
    is_collector_scope = (
        complaint.criticality_level in ["CRITICAL", "HIGH"] and
        any(k in (complaint.text_content or "").lower() for k in ["district", "multi-ward", "collector", "hospital"])
    )
    if is_collector_scope:
        collector_official = db.query(Official).filter(Official.role == "COLLECTOR").first()
        if collector_official:
            return collector_official.id, 2

    # Tier 1 - MLA level (Default)
    # Extract ward number from complaint (default to Suresh K. Ward 7 if not specified)
    ward_str = complaint.ward or "Ward 7"
    
    # Try to find MLA for this specific jurisdiction
    mla_official = db.query(Official).filter(
        Official.role == "MLA", 
        Official.jurisdiction.like(f"%{ward_str}%")
    ).first()
    
    if not mla_official:
        # Fallback to Suresh K. (our main demo MLA)
        mla_official = db.query(Official).filter(Official.role == "MLA").first()
        
    if mla_official:
        return mla_official.id, 1
        
    # Absolute fallback to first official in system
    fallback_official = db.query(Official).first()
    return (fallback_official.id if fallback_official else None), 1
