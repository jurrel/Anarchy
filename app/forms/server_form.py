
from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, SubmitField
from wtforms.validators import DataRequired


class serverForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    owner_id = IntegerField('Owner_')
    imageUrl = StringField('Image Url')
    submit = SubmitField("Submit")
