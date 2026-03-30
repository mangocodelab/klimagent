def validate_email(email):
    """
    Validates an email address by checking for @ and . characters
    :param email: Email address to validate
    :return: True if valid, False otherwise
    """
    if '@' in email and '.' in email:
        return True
    return False