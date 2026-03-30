import os
import sys
import time
import openai
import nvidia_llm

# Initialize NVIDIA NIM client
nim_client = nvidia_llm.Client()

def main():
    # Get user input
    user_input = input("Enter your request: ")
    
    # Process with NVIDIA NIM
    response = nim_client.process_request(user_input)
    
    # Output response
    print("NVIDIA NIM Response:", response)

if __name__ == "__main__":
    main()