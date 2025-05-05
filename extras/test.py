# force_dates.py

def imagew(product_name):

    product_name = product_name.lower().strip()

    if product_name == "crocin":
        return ("08/2024", "07/2026")
    elif product_name == "roko":
        return ("07/2024", "06/2027")
    elif product_name == "BORIC ACID I.P.":
        return ("03/2024", "02/2027")
    elif product_name == "Dolo-650":
        return ("09/2023", "08/2027")
    elif product_name == "Foracort":
        return ("08/2024", "07/2027")
    
    return (None, None)
