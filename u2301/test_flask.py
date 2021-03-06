from unittest import TestCase

from app import app
from models import db, User

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly_test'
app.config['SQLALCHEMY_ECHO'] = False

app.config['TESTING'] = True

app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

db.drop_all()
db.create_all()


class UserViewsTestCase(TestCase):
    """Tests for views for Users."""

    def setUp(self):
        """Add sample pet."""

        User.query.delete()

        user = User(
            first_name="Test", 
            last_name="User", 
            image_url="https://cdn.pixabay.com/photo/2016/03/31/20/33/head-1295862_960_720.png"
        )
        db.session.add(user)
        db.session.commit()

        self.user_id = user.id
        self.user = user

    def tearDown(self):
        """Clean up any fouled transaction."""

        db.session.rollback()

    # test - 1
    def test_users_page(self):
        with app.test_client() as client:
            resp = client.get("/users")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('Test User', html)

    # test - 2
    def test_show_user(self):
        with app.test_client() as client:
            resp = client.get(f"/users/{self.user_id}")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<h1>User Details</h1>', html)
            self.assertIn(f"{self.user.first_name} {self.user.last_name}", html)

    # test - 3
    def test_adding_user(self):
        with app.test_client() as client:
            u = {
                "first_name": "Testing",
                "last_name": "User2",
                "image_url": "https://cdn1.iconfinder.com/data/icons/avatars-vol-2/140/_robocop-512.png"
            }
            resp = client.post("/users/new", data=u, follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("Testing User2", html)

    # test - 4
    def test_delete_user(self):
        with app.test_client() as client:
            # User.query.filter_by(id=self.user_id).delete()
            resp = client.post(f"/users/{self.user_id}/delete", follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertNotIn(f"Test User", html)


