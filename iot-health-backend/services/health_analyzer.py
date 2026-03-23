def analyze_health(bpm: float, spo2: float, accel: float) -> str:
    """
    Rule-based health alert analyzer.

    Priority order:
    1. LOW OXYGEN (most critical)
    2. FALL DETECTED
    3. HIGH HEART RATE
    4. NORMAL

    Returns:
        str: Alert message string.
    """
    if spo2 < 90:
        return "LOW OXYGEN"
    if accel > 2.5:
        return "FALL DETECTED"
    if bpm > 120:
        return "HIGH HEART RATE"
    return "NORMAL"
