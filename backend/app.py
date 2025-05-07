
from flask import Flask, request, jsonify, Blueprint, make_response
from flask_cors import CORS
from src.utils.mongo_db import MongoDB
import jwt
import datetime
import os
import logging

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://subs001.bixbites.com"}})
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
mongo_db = MongoDB()

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided!'}), 400
    
    response = mongo_db.create_user(data)
    return response

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No input data provided!'}), 400

        email = data.get('email')
        password = data.get('password')

        # Validate presence of email and password
        if not email or not password:
            return jsonify({'message': 'Email and password are required.'}), 400

        # Basic email format validation
        if '@' not in email or '.' not in email:
            return jsonify({'message': 'Invalid email format.'}), 400

        # Find user by email
        user = mongo_db.find_user_by_email(email)
        if not user:
            return jsonify({'message': 'Invalid email or password.'}), 401

        # Validate user credentials
        if not mongo_db.validate_user_credentials(email, password):
            return jsonify({'message': 'Invalid email or password.'}), 401

        # Generate JWT token
        token_payload = {
            'user_id': str(user['_id']),
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }
        token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm='HS256')

        # Prepare response
        response = {
            'token': token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name', '')
            }
        }
        return jsonify(response), 200

    except Exception as e:
        logging.exception("Error during login process")
        return jsonify({'message': 'An error occurred during login.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
