"""User model tests."""

# run these tests like:
#
#    python -m unittest test_user_model.py


import os
from unittest import TestCase, expectedFailure

from models import db, User, Message, Follows

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

db.create_all()


USER_DATA_1 = {
    "email": "test_1@test.com",
    "username": "testuser_1",
    "password": "HASHED_PASSWORD_1",
    "image_url": "http://test.com/pic_1.jpg",
    "header_image_url": "http://test.com/header_pic_1.jpg",
    "bio": "I am a test user_1.",
    "location":"testland_1"
}

USER_DATA_2 = {
    "email": "test_2@test.com",
    "username": "testuser_2",
    "password": "HASHED_PASSWORD_2",
    "image_url": "http://test.com/pic_2.jpg",
    "header_image_url": "http://test.com/header_pic_2.jpg",
    "bio": "I am a test user_2.",
    "location":"testland_2"
}


class UserModelTestCase(TestCase):
    """Test models for users."""

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Message.query.delete()
        Follows.query.delete()

        self.client = app.test_client()

        user_1 = User(**USER_DATA_1)
        user_2 = User(**USER_DATA_2)
        db.session.add_all([user_1, user_2])
        db.session.commit()

        self.user_1 = user_1
        self.user_2 = user_2

    def tearDown(self):
        """Clean up fouled transactions."""

        db.session.rollback()

    def test_user_model(self):
        """Does basic model work?"""

        u = User(
            email="test@test.com",
            username="testuser",
            password="HASHED_PASSWORD"
        )

        db.session.add(u)
        db.session.commit()

        # User should have no messages & no followers
        self.assertEqual(len(u.messages), 0)
        self.assertEqual(len(u.followers), 0)


    def test_user_repr_method(self):
        """Does repr method work as expected?"""

        self.assertIn("<User #", repr(self.user_1))
        self.assertIn(": testuser_1, test_1@test.com>", repr(self.user_1))
        self.assertIn("<User #", repr(self.user_2))
        self.assertIn(": testuser_2, test_2@test.com>", repr(self.user_2))


    def test_user_is_following(self):
        """Does is_following method work as expected?"""
        
        # user_1 follows user_2
        self.user_1.following.append(self.user_2)

        # tests of is_following method
        self.assertTrue(self.user_1.is_following(self.user_2))
        self.assertFalse(self.user_2.is_following(self.user_1))


    def test_user_is_followed_by(self):
        """Does is_followed_by method work as expected?"""

        # user_1 follows user_2
        self.user_1.following.append(self.user_2)

        # tests of is_followed_by method
        self.assertFalse(self.user_1.is_followed_by(self.user_2))
        self.assertTrue(self.user_2.is_followed_by(self.user_1))


    def test_user_signup_success(self):
        """Does signup class method work as expected at success?"""
        
        signedup_user = User.signup(username="testuser",
                                    email="test@test.com",
                                    password="testuser",
                                    image_url=None)

        db.session.commit()

        testuser = User.query.filter_by(username="testuser").one()

        self.assertEqual(signedup_user, testuser)

        self.assertEqual(User.query.count(), 3)


    @expectedFailure
    def test_user_signup_fail_1(self):
        """Does signup class method work as expected at fail?"""
            
        User.signup(username="testuser",
                    email=None,               # email should not be null
                    password="testuser",
                    image_url=None)

        db.session.commit()


    @expectedFailure
    def test_user_signup_fail_2(self):
        """>>>Does signup class method work as expected at fail?"""
            
        User.signup(username="testuser_1",   # existing username
                    email="test@test.com",
                    password="testuser",
                    image_url=None)

        db.session.commit()


    @expectedFailure
    def test_user_signup_fail_3(self):
        """Does signup class method work as expected at fail?"""
            
        User.signup(username="testuser",
                    email="test_2@test.com",   # existing email
                    password="testuser",
                    image_url=None)

        db.session.commit()


    def test_user_authenticate(self):
        """Does authenticate class method work as expected?"""
            
        user = User.signup(username="testuser",
                           email="test@test.com",
                           password="pass123",
                           image_url=None)

        db.session.commit()
        
        # Authentication with correct credentials
        auth_user = User.authenticate(username="testuser",
                                      password="pass123")

        self.assertEqual(user, auth_user)
        
        # Failed authentication with invalid username
        wrong_user = User.authenticate(username="wrong_username",
                                      password="pass123")

        self.assertNotEqual(user, wrong_user)
        
        # Failed authentication with invalid password
        wrong_pass = User.authenticate(username="testuser",
                                      password="wrong_password")

        self.assertNotEqual(user, wrong_pass)
    




"""
Does User.authenticate successfully return a user when given a valid username and password?
Does User.authenticate fail to return a user when the username is invalid?
Does User.authenticate fail to return a user when the password is invalid?
"""