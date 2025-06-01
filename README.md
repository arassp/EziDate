# Ezekiel Bread Lot Number Decoder

A simple web tool (with on the go scanning capabilities) to decode the 5-character lot numbers found on Ezekiel bread packaging. It converts the code into a readable production date using an encoded year, day of year, and offset.

**Live site:** [[Click Here](https://arassp.github.io/EziDate/)]

## Format

Lot number format: `LDDD#`  
- `L` — Encoded year (as a letter)  
- `DDD` — Day of the year  
- `#` — Offset added to the day count

Leap years and year transitions are supported.

## Disclaimer

This project is not affiliated with or endorsed by Food For Life Baking Co., makers of Ezekiel bread. It is provided for personal and educational use only.
