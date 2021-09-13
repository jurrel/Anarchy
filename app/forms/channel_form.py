
from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, SubmitField
from wtforms.validators import DataRequired


class ChannelForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    type = IntegerField('Type', validators=[DataRequired()])
    submit = SubmitField("Submit")

