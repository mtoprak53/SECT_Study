from flask import Flask, render_template, redirect, flash, jsonify, url_for

from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, Pet
from forms import AddPetForm, EditPetForm

app = Flask(__name__)

app.config['SECRET_KEY'] = "azkabantutsagi536109"

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///pet_db'
app.config['SQLALCHEMY_TRACK_MODIICATIONS'] = False

connect_db(app)
db.create_all()   # ??

# app.config['SQLALCHEMY_ECHO'] = True

# Having the Debug Toolbar show redirects explicitly is often useful;
# however, if you want to turn it off, you can uncomment this line:
#
# app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

toolbar = DebugToolbarExtension(app)


##############################################################################


@app.route('/')
def list_pets():
    """shows the pets on homepage."""

    pets = Pet.query.all()
    return render_template("pet_list.html", pets=pets)


@app.route('/add', methods=["GET", "POST"])
def add_pet():
    """shows the form to add a new pet."""

    form = AddPetForm()
    
    if form.validate_on_submit():

        data = {k: v for k, v in form.data.items() if k != "csrf_token"}
        new_pet = Pet(**data)
        # new_pet = Pet(name=form.name.data, age=form.age.data, ...)

        db.session.add(new_pet)
        db.session.commit()

        flash(f"{new_pet.name} added.")
        return redirect(url_for('list_pets'))

    else:
        # re-present form for editing
        return render_template("add_pet_form.html", form=form)


@app.route('/<int:pet_id>', methods=["GET", "POST"])
def edit_pet(pet_id):
    """shows the details of a pet and a partial edit form."""
    
    pet = Pet.query.get_or_404(pet_id)
    form = EditPetForm(obj=pet)

    if form.validate_on_submit():
        pet.photo_url = form.photo_url.data
        pet.notes = form.notes.data
        pet.available = form.available.data
        db.session.commit()

        flash(f"{pet.name} updated.")
        return redirect(url_for('list_pets'))

    else:
        # failed; re-present form for editing
        return render_template('pet_edit_form.html', form=form, pet=pet)


@app.route('/api/pets/<int:pet_id>', methods=["GET"])
def api_get_pet(pet_id):
    """Return basic info about pet in JSON."""

    pet = Pet.query.get_or_404(pet_id)
    info = {"name": pet.name, "age": pet.age}

    return jsonify(info)