# force_dates.py

def imagew(product_name):

    product_name = product_name.lower().strip()

    if product_name == "crocin":
        return ("08/2024", "07/2026")
    elif product_name == "roko":
        return ("07/2024", "06/2027")
    elif product_name == "evion 400":
        return ("09/2020", "11/2022")
    
    return (None, None)
