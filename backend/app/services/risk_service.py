from typing import Dict, Any, List

def analyze_wellbeing_risk(
    mood: int = 3,
    energy_level: int = 3,
    stress_level: int = 2,
    sleep_hours: float = 7.0,
    academic_pressure: int = 3
) -> Dict[str, Any]:
    """
    Deterministic rule-based risk calculation.
    Modular design allows seamless replacement with a trained ML model in the future.
    
    IMPORTANT: This calculation is an early-warning wellbeing pattern indicator,
    NOT a clinical diagnosis or medical assessment.
    """
    contributing_factors: List[str] = []
    recommendations: List[str] = []
    
    # Base risk score calculation (0 - 100)
    score = 0.0
    
    # Stress contribution (max 30 points)
    if stress_level >= 4:
        score += 30.0
        contributing_factors.append("High self-reported stress levels")
        recommendations.append("Practice a short 2-minute breathing reset")
    elif stress_level == 3:
        score += 15.0
        contributing_factors.append("Moderate academic stress")
        
    # Academic pressure (max 25 points)
    if academic_pressure >= 4:
        score += 25.0
        contributing_factors.append("Heavy perceived workload or assignment deadline pressure")
        recommendations.append("Break down upcoming tasks into smaller 25-minute study intervals")
    elif academic_pressure == 3:
        score += 12.0
        
    # Sleep deprivation (max 25 points)
    if sleep_hours < 5.0:
        score += 25.0
        contributing_factors.append("Severe sleep deficiency (< 5 hours)")
        recommendations.append("Prioritize sleep recovery before late-night studying")
    elif sleep_hours < 6.5:
        score += 15.0
        contributing_factors.append("Sub-optimal sleep (< 6.5 hours)")
        recommendations.append("Aim for a consistent bedtime schedule")
        
    # Mood & Energy deficit (max 20 points)
    if mood <= 2:
        score += 10.0
        contributing_factors.append("Low self-reported mood rating")
    if energy_level <= 2:
        score += 10.0
        contributing_factors.append("Low energy levels")
        recommendations.append("Take a brief outdoor walk or hydration break")
        
    # Clamp score between 0 and 100
    risk_score = round(min(100.0, max(0.0, score)), 1)
    
    # Determine risk level
    if risk_score < 30.0:
        risk_level = "low"
        explanation = "Routine patterns are steady. Keep maintaining your healthy balance of study and rest."
        if not recommendations:
            recommendations.append("Keep up your regular routine and hydration")
    elif risk_score < 65.0:
        risk_level = "moderate"
        explanation = "Recent check-ins indicate moderate routine shifts in stress or sleep pattern."
    else:
        risk_level = "high"
        explanation = "Noticeable routine variance detected across stress, sleep, and academic load."
        recommendations.append("Consider speaking with a trusted mentor or campus support counselor")
        
    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "contributing_factors": contributing_factors,
        "recommendations": recommendations,
        "explanation": explanation
    }
