
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length


class ServerForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(min=3)])
    imageUrl = StringField('Image Url')
    submit = SubmitField("Submit")
