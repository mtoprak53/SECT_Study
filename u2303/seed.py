"""Seed file for the users DB"""

from models import db, User, Post, Tag, PostTag
from app import app

# Create all tables
db.drop_all()
db.create_all()

# If not empty, empty
User.query.delete()
Post.query.delete()
Tag.query.delete()
PostTag.query.delete()

# Add sample users and posts
kamil = User(first_name='Kamil', last_name='Sönmez', 
    image_url='https://d35fbhjemrkr2a.cloudfront.net/Images/Shop/31/Product/5046/Thumb/51-3.jpg')
baturalp = User(first_name='Baturalp', last_name='Dinçdarı',
    image_url='https://listelist.com/wp-content/uploads/2015/12/baturalp-sidika.jpg')
sahika = User(first_name='Şahika', last_name='Koçarslanlı',
    image_url='https://pbs.twimg.com/profile_images/1124339674/30422_395695259435_8534864435_4427389_3466681_n_400x400.jpg')
franz = User(first_name='Franz', last_name='Beckenbauer',
    image_url='http://www.footballtop.com/sites/default/files/styles/player_full/public/photos/players/8c6f5d38f625.jpg?itok=RZkODDLA')
andy = User(first_name='Andreas', last_name='Möller',
    image_url='https://img.fifa.com/image/upload/t_s2/w9zk4frpowwsrtiw3dl0.jpg')
post1 = Post(title = 'First Blog',
    content = "This is the first blog.",
    user_id = 3)
post2 = Post(title = 'Second Blog',
    content = "This is the second blog.",
    user_id = 2)
post3 = Post(title = 'Another Blog',
    content = "This is another blog. It has been many posts.",
    user_id = 5)
post4 = Post(title = 'Kamil\'s Blog',
    content = "This is Kamil's blog. I'm Kamil.",
    user_id = 1)

db.session.add_all([kamil, baturalp, sahika, franz, andy])# Add them to session
db.session.commit()# Commit them
db.session.add_all([post1, post2, post3, post4])
db.session.commit()

tag_fun = Tag(name='fun', matches=[PostTag(post_id=1), PostTag(post_id=3)])
tag_sad = Tag(name='sad', matches=[PostTag(post_id=2), PostTag(post_id=3)])
tag_exciting = Tag(name='exciting', 
                   matches=[PostTag(post_id=1), PostTag(post_id=2)])
tag_boring = Tag(name='boring', matches=[PostTag(post_id=4)])

db.session.add_all([tag_fun, tag_sad, tag_exciting, tag_boring])
db.session.commit()