
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired


class ServerForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    imageUrl = StringField('Image Url')
    submit = SubmitField("Submit")
