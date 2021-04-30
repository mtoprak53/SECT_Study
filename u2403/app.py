"""Flask app for Cupcakes"""

from flask import Flask, request, jsonify, render_template
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "oh-so-secret"

connect_db(app)


@app.route("/")
def index_page():
    """Render homepage."""

    cupcakes = Cupcake.query.all()
    return render_template("index.html", cupcakes=cupcakes)


@app.route('/api/cupcakes')
def list_cupcakes():
    """Return all cupcakes in system.

    Returns JSON like:
        {cupcakes: [{id, flavor, rating, size, image}, ...]}
    """

    all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=all_cupcakes)


@app.route("/api/cupcakes/<int:id>")
def get_cupcake(id):
    """Return data on specific cupcake.

    Returns JSON like:
        {cupcake: [{id, flavor, rating, size, image}]}
    """

    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake=cupcake.serialize())


@app.route("/api/cupcakes", methods=["POST"])
def create_cupcake():
    """Add cupcake, and return data about new cupcake.

    Returns JSON like:
        {cupcake: [{id, flavor, rating, size, image}]}
    """

    new_cupcake = Cupcake(
        flavor=request.json["flavor"],
        size=request.json["size"],
        rating=request.json["rating"],
    )
    if request.json["image"]:
        new_cupcake.image = request.json.get("image")
    db.session.add(new_cupcake)
    db.session.commit()
    response_json = jsonify(cupcake=new_cupcake.serialize())

    # POST requests should return HTTP status of 201 CREATED
    return (response_json, 201)


@app.route("/api/cupcakes/<int:id>", methods=["PATCH"])
def update_cupcake(id):
    """Update cupcake from data in request. Return updated data.

    Returns JSON like:
        {cupcake: [{id, flavor, rating, size, image}]}
    """

    data = request.json

    cupcake = Cupcake.query.get_or_404(id)

    cupcake.flavor = data['flavor']
    cupcake.rating = data['rating']
    cupcake.size = data['size']
    cupcake.image = data['image']

    db.session.add(cupcake)
    db.session.commit()
    
    return jsonify(cupcake=cupcake.serialize())


@app.route("/api/cupcakes/<int:id>", methods=["DELETE"])
def delete_cupcake(id):
    """Delete cupcake and return confirmation message.

    Returns JSON of {message: "Deleted"}
    """

    cupcake = Cupcake.query.get_or_404(id)

    db.session.delete(cupcake)
    db.session.commit()
    
    return jsonify(message="deleted")