"""Models for Cupcake app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)


GENERIC_IMAGE = "https://tinyurl.com/demo-cupcake"


class Cupcake(db.Model):
    """ A cupcake model."""

    __tablename__ = "cupcakes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.Text, nullable=False)
    size = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    image = db.Column(db.Text, nullable=False, default=GENERIC_IMAGE)

    def serialize(self):
        """Serialize cupcake to a dict of cupcake info."""

        return {
            'id': self.id,
            'flavor': self.flavor,
            'size': self.size,
            'rating': self.rating,
            'image': self.image,
        }

    def __repr__(self):
        return f"<Cupcake {self.id} flavor={self.flavor} size={self.size} rating={self.rating}>"







