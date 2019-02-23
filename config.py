from flask_sqlalchemy import SQLAlchemy

from app import app

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://flwxebtzpunihb:b2a44a6922588ca95d9acae686c4604e5feffe421f4127a04812' \
                                        'f942d11e295d@ec2-50-17-193-83.compute-1.amazonaws.com:5432/d5shgthfdb4nb0'
db = SQLAlchemy(app)
