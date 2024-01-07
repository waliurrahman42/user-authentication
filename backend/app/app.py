from create_app import create_app
from flask_cors import CORS
from models.db import db
from routes.auth_routes import auth_routes
from routes.user_routes import user_routes
from routes.userAddress_routes import address_routes

app = create_app()

# Enable Cross-Origin Resource Sharing (CORS) for the application
CORS(app, origins="http://localhost:3000",supports_credentials=True)

# Create tables
with app.app_context():
    db.create_all()


# Register Blueprints
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(user_routes, url_prefix='/api/user')
app.register_blueprint(address_routes, url_prefix='/api/userAddress')

if __name__ == '__main__':
    app.run(debug=True)
