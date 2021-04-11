"""Message View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_message_views.py

import os
from unittest import TestCase

from models import db, connect_db, Message, User

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


class MessageViewTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Message.query.delete()

        self.client = app.test_client()

        self.testuser = User.signup(username="testuser",
                                    email="test@test.com",
                                    password="testuser",
                                    image_url=None)

        self.testuser_2 = User.signup(username="testuser_2",
                                      email="test_2@test.com",
                                      password="testuser_2",
                                      image_url=None)

        db.session.commit()

    def tearDown(self):
        """Clean up any fouled transaction."""

        db.session.rollback()


    def test_add_message(self):
        """Logged in user can post message as herself?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            # Now, that session setting is saved, so we can have
            # the rest of ours test

            resp = c.post("/messages/new", data={"text": "Hello"})

            # Make sure it redirects
            self.assertEqual(resp.status_code, 302)

            msg = Message.query.one()
            self.assertEqual(msg.text, "Hello")
        

    def test_delete_message(self):
        """Logged in user can delete her message?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            # Now, that session setting is saved, so we can have
            # the rest of ours test

            c.post("/messages/new", data={"text": "Hello"})
            msg = Message.query.one()
            resp = c.post(f"/messages/{msg.id}/delete")
            msg = Message.query.all()

            # Make sure it redirects
            self.assertEqual(resp.status_code, 302)  # status code of redirect
            
            # no messages left
            self.assertEqual(len(msg), 0)


    def test_logout_add_message(self):
        """Posting message is prohibited when logged out?"""

        with self.client as c:

            # logged out user

            resp = c.post("/messages/new", data={"text": "Hello"})

            # Make sure it redirects
            self.assertEqual(resp.status_code, 302)

            msg = Message.query.all()

            # no messages left
            self.assertEqual(len(msg), 0)
        

    def test_logout_delete_message(self):
        """Deleting message is prohibited when logged out?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            # Now, that session setting is saved, so we can have
            # the rest of ours test

            c.post("/messages/new", data={"text": "Hello"})

            # mimic logging out
            with c.session_transaction() as sess:
                del sess[CURR_USER_KEY]

            msg = Message.query.one()
            resp = c.post(f"/messages/{msg.id}/delete")
            
            # Make sure it redirects
            self.assertEqual(resp.status_code, 302)  # status code of redirect

            msg = Message.query.all()
            
            # message remains
            self.assertEqual(len(msg), 1)


    def test_login_else_add_message(self):
        """Logged in user is prohibited from posting message as another user?"""

        with self.client as c:
            
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.post(
                "/messages/new", 
                data={"text": "Hello"}, 
                follow_redirects=True
            )

            # Make sure it redirects
            self.assertEqual(resp.status_code, 200)

            msg = Message.query.one()
            self.assertEqual(msg.text, "Hello")

            self.assertEqual(msg.user_id, self.testuser.id)            
        

    def test_login_else_delete_message(self):
        """Logged in user is prohibited from deleting other people's messages?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:

        with self.client as c:
            # with c.session_transaction() as sess:
            #     sess[CURR_USER_KEY] = self.testuser_2.id

            # Now, that session setting is saved, so we can have
            # the rest of ours test

            message = Message(
                text="Yaba Daba Duu",
                user_id=self.testuser_2.id
            )

            db.session.add(message)
            db.session.commit()

            # mimic logging out
            with c.session_transaction() as sess:
                # del sess[CURR_USER_KEY]
                sess[CURR_USER_KEY] = self.testuser.id

            msg = Message.query.one()
            resp = c.post(f"/messages/{msg.id}/delete")
            
            # Make sure it redirects
            self.assertEqual(resp.status_code, 302)  # status code of redirect

            all_msg = Message.query.all()
            
            # # message remains
            self.assertEqual(len(all_msg), 1)
            self.assertIn(msg, all_msg)
