"""Seed file for the users DB"""

from models import User, db
from app import app

# Create all tables
db.drop_all()
db.create_all()

# If not empty, empty
User.query.delete()

# Add users
kamil = User(
    first_name='Kamil', last_name='Sönmez', 
    image_url='https://d35fbhjemrkr2a.cloudfront.net/Images/Shop/31/Product/5046/Thumb/51-3.jpg'
)

baturalp = User(
    first_name='Baturalp', last_name='Dinçdarı',
    image_url='https://listelist.com/wp-content/uploads/2015/12/baturalp-sidika.jpg'
)

sahika = User(
    first_name='Şahika', last_name='Koçarslanlı',
    image_url='https://pbs.twimg.com/profile_images/1124339674/30422_395695259435_8534864435_4427389_3466681_n_400x400.jpg'
)

franz = User(
    first_name='Franz', last_name='Beckenbauer',
    image_url='http://www.footballtop.com/sites/default/files/styles/player_full/public/photos/players/8c6f5d38f625.jpg?itok=RZkODDLA'
)

andy = User(
    first_name='Andreas', last_name='Möller',
    image_url='https://img.fifa.com/image/upload/t_s2/w9zk4frpowwsrtiw3dl0.jpg'
)

# Add them to session
db.session.add(kamil)
db.session.add(baturalp)
db.session.add(sahika)
db.session.add(franz)
db.session.add(andy)

# Commit them
db.session.commit()