def generate_negotiation_email(customer_name, dealer_name, red_flags):
    fees_list = ", ".join(red_flags)
    email_body = f"""
    Dear {dealer_name},
    
    I have reviewed the lease proposal for {customer_name}. 
    I am interested in the vehicle, but I noticed several charges that are 
    above market average: {fees_list}.
    
    Based on current market data, I am looking for a contract that removes 
    these add-ons. Please let me know if you can adjust these terms.
    
    Best regards,
    [Assistant]
    """
    return email_body