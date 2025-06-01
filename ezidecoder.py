from datetime import datetime, timedelta

def get_year_from_letter(letter):
    if len(letter) == 1 and letter.isalpha():
        year = ord(letter.upper()) + 1935
        current_year = datetime.now().year
        if 2015 <= year <= current_year:
            return year
    return None

def decode_lot_number(code):
    if len(code) != 5:
        return "Invalid format"

    letter = code[0]
    day_str = code[1:4]
    offset_str = code[4]

    if not day_str.isdigit() or not offset_str.isdigit():
        return "Invalid format"

    year = get_year_from_letter(letter)
    if year is None:
        return "Invalid year code"

    doy = int(day_str)
    offset = int(offset_str)
    final_day = doy + offset

    # Adjust for overflow beyond the year
    if final_day > 365 and not (year % 4 == 0 and final_day <= 366):
        final_day -= 365
        year += 1

    try:
        date = datetime(year, 1, 1) + timedelta(days=final_day - 1)
        return date.strftime("%B %d, %Y")
    except ValueError:
        return "Invalid date calculation"

# Example usage
if __name__ == "__main__":
    code = input("Enter the 5-character lot number: ").strip().upper()
    print("Production Date:", decode_lot_number(code))