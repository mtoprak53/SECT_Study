"""User View tests."""

# run these tests like:
#
#   FLASK_ENV=production python -m unittest test_message_views.py

import os
from unittest import TestCase

from models import db, connect_db, Message, User, Follows, Likes

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app, CURR_USER_KEY

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

db.create_all()

# Don't have WTForms use CSRF at all, since it's a pain to test

app.config['WTF_CSRF_ENABLED'] = False


class UserViewTestCase(TestCase):
    """Test views for users."""

    def setUp(self):
        """Create test client, add sample data"""

        User.query.delete()
        Message.query.delete()
        Follows.query.delete()
        Likes.query.delete()

        # OR 
        # db.drop_all()
        # db.create_all()

        self.client = app.test_client()

        self.testuser_1 = User.signup(username="testuser_1",
                                    email="test_1@test.com",
                                    password="testuser_1",
                                    image_url=None)

        self.testuser_2 = User.signup(username="testuser_2",
                                      email="test_2@test.com",
                                      password="testuser_2",
                                      image_url=None)

        db.session.commit()

        self.testuser_1.following.append(self.testuser_2)

        self.testmessage_1 = Message(text="This is the first test message!",
                                     user_id=self.testuser_1.id)
                                        
        self.testmessage_2 = Message(text="This is the second test message!",
                                     user_id=self.testuser_2.id)

        db.session.add(self.testmessage_1)
        db.session.add(self.testmessage_2)

        db.session.commit()

        like_1 = Likes(
            user_id=self.testuser_1.id, 
            message_id=self.testmessage_2.id
        )

        like_2 = Likes(
            user_id=self.testuser_2.id, 
            message_id=self.testmessage_1.id
        )

        db.session.add(like_1)
        db.session.add(like_2)
        db.session.commit()

    
    def tearDown(self):
        """Clean up any fouled transaction."""

        db.session.rollback()

    # 1
    def test_list_users(self):
        """Does list users work as expected?"""
        
        with self.client as c:

            resp = c.get("/users?q=test")
            html = resp.get_data(as_text=True)

            # Correct status code?
            self.assertEqual(resp.status_code, 200)

            # Does it show registered users?
            self.assertIn("<p>@testuser_1</p>", html)
            self.assertIn("<p>@testuser_2</p>", html)

    # 2
    def test_users_show(self):
        """Does users' homepages work as expected?"""
        
        with self.client as c:

            resp_1 = c.get(f"/users/{self.testuser_1.id}")
            html_1 = resp_1.get_data(as_text=True)

            resp_2 = c.get(f"/users/{self.testuser_2.id}")
            html_2 = resp_2.get_data(as_text=True)

            # Correct status code?
            self.assertEqual(resp_1.status_code, 200)
            self.assertEqual(resp_2.status_code, 200)

            # Does it show registered users?
            self.assertIn("<p>This is the first test message!</p>", html_1)
            self.assertIn("<p>This is the second test message!</p>", html_2)

    # 3
    def test_show_following(self):
        """Can a logged in user see any user's followings list?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser_1.id

            # Now, that session setting is saved, so we can have
            # the rest of ours test

            resp = c.get(f"/users/{sess[CURR_USER_KEY]}/following")
            html = resp.get_data(as_text=True)

            # Correct status code?
            self.assertEqual(resp.status_code, 200)

            # Does it show following users?
            self.assertIn("<p>@testuser_2</p>", html)

    # 4
    def test_show_followers(self):
        """Can a logged in user see any user's followers list?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:

        with self.client as c:
            with c.session_transaction() as sess:

                # signed in as testuser_2
                sess[CURR_USER_KEY] = self.testuser_2.id

            resp = c.get(f"/users/{sess[CURR_USER_KEY]}/followers")
            html = resp.get_data(as_text=True)

            # Correct status code?
            self.assertEqual(resp.status_code, 200)

            # Does it show follower users?
            self.assertIn("<p>@testuser_1</p>", html)

    # 5
    def test_show_likes(self):
        """Can a logged in user see any user's liked messages list?"""

        with self.client as c:

            testuser_1 = User.query.filter_by(username="testuser_1").one()
            testuser_2 = User.query.filter_by(username="testuser_2").one()

            # sign in as testuser_1
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = testuser_1.id

            resp_1 = c.get(f"/users/{testuser_1.id}/likes")
            resp_2 = c.get(f"/users/{testuser_2.id}/likes")
            html_1 = resp_1.get_data(as_text=True)
            html_2 = resp_2.get_data(as_text=True)

            # Correct status code?
            self.assertEqual(resp_1.status_code, 200)
            self.assertEqual(resp_2.status_code, 200)

            # Does it show liked messages?
            self.assertIn("<p>This is the second test message!</p>", html_1)
            self.assertIn("<p>This is the first test message!</p>", html_2)

    #6
    def test_add_follow(self):
        """Can a logged in user follow another user?"""

        with self.client as c:

            testuser_1 = User.query.filter_by(username="testuser_1").one()
            testuser_2 = User.query.filter_by(username="testuser_2").one()

            # sign in as testuser_2
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = testuser_2.id

            resp = c.post(
                f"/users/follow/{testuser_1.id}", 
                follow_redirects=True
            )

            # Make sure it redirects
            self.assertEqual(resp.status_code, 200)

            # can testuser_2 successfully follow testuser_1
            self.assertTrue(
                Follows.query.filter_by(
                    user_being_followed_id = testuser_1.id, 
                    user_following_id = testuser_2.id
                ).one_or_none()
            )

    #7
    def test_stop_following(self):
        """Can a logged in user stop following another user?"""

        with self.client as c:

            testuser_1 = User.query.filter_by(username="testuser_1").one()
            testuser_2 = User.query.filter_by(username="testuser_2").one()

            # sign in as testuser_1
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = testuser_1.id

            resp = c.post(
                f"/users/stop-following/{testuser_2.id}", 
                follow_redirects=True
            )

            # Make sure it redirects
            self.assertEqual(resp.status_code, 200)

            # can testuser_1 successfully stop following testuser_2
            self.assertFalse(
                Follows.query.filter_by(
                    user_being_followed_id = testuser_2.id, 
                    user_following_id = testuser_1.id
                ).one_or_none()
            )

    #8
    def test_get_profile(self):
        """Can a logged in user see the profile edit page?"""

        with self.client as c:

            # sign in as testuser_1
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser_1.id

            resp = c.get(f"/users/profile")
            html = resp.get_data(as_text=True)

            # Make sure it redirects
            self.assertEqual(resp.status_code, 200)

            # can we see the correct HTML page
            self.assertIn(f'value="{self.testuser_1.email}">', html)
    
    #9
    def test_post_profile(self):
        """Can a logged in user edit her profile?"""

        with self.client as c:

            # sign in as testuser_1
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser_1.id

            resp = c.post(
                f"/users/profile", 
                data={
                    'username': 'changed_username',
                    'password': 'testuser_1',
                    'email': 'changed@email.address'
                },
                follow_redirects=True
            )

            # Make sure it redirects
            self.assertEqual(resp.status_code, 200)

            # Could we change the username
            self.assertTrue(
                User.query
                    .filter_by(username = "changed_username")
                    .one_or_none()
            )
            self.assertTrue(User.query.get(sess[CURR_USER_KEY]))

    #10
    def test_delete_user(self):
        """Can a logged in user delete her profile?"""

        with self.client as c:

            # sign in as testuser_1
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser_1.id

            resp = c.post(f"/users/delete", follow_redirects=True)
            html = resp.get_data(as_text=True)

            # Make sure it redirects
            self.assertEqual(resp.status_code, 200)

            # Could we change the username
            self.assertIsNone(
                User.query
                    .filter_by(username = "testuser_1")
                    .one_or_none()
            )
            self.assertIsNone(User.query.get(sess[CURR_USER_KEY]))

            # Are we directed to signup page
            self.assertIn('<h2 class="join-message">Join Warbler today.</h2>', html)

    #11 (INCOMPLETE)
    def test_like_warble(self):
        """Can a user like a warble?"""

        pass


    #12 (INCOMPLETE)
    def test_unauthorized_access_attempts(self):
        """Is a logged out user blocked to reach unauthorized contents?"""

        # logged out accesses:
        # a users's following contacts
        # a users's follower contacts
        # a user's liked warbles list
        # to add a user
        # to stop following a user
        # to edit a user
        # to delete a user
        # to like a warble

        # Logged in accesses:
        # signup
        # login

        pass

