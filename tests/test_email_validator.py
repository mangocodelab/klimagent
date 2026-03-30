import unittest
import sys
import os

# Add the src directory to the path to import the email_validator module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from email_validator import validate_email

class TestEmailValidator(unittest.TestCase):
    def test_valid_email(self):
        """Test that valid emails return True"""
        self.assertTrue(validate_email('test@example.com'))
        self.assertTrue(validate_email('user.name@domain.co.uk'))
        
    def test_invalid_email(self):
        """Test that invalid emails return False"""
        self.assertFalse(validate_email('invalid-email'))
        self.assertFalse(validate_email('another@invalid'))
        self.assertFalse(validate_email('alsoinvalid.com'))
        self.assertFalse(validate_email('@invalid.com'))
        
if __name__ == '__main__':
    unittest.main()