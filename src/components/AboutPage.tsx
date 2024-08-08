import React from "react";

const AboutPage: React.FC = () => {
    return (
        <div className="container">
            <section className="hero">
                <div className="hero-body">
                    <p className="title">About us</p>
                    <p className="subtitle">
                        Get to know a little about who we are, where we've been,
                        and what we stand for.
                    </p>
                </div>
            </section>
            <section className="section">
                <div className="content">
                    <h2 className="title is-3">Our Story</h2>
                    <p>
                        Snacky Trails is, at it's core, a mom and pop shop just
                        getting off the ground with a goal to serve excellent
                        food and experiences to our community.
                    </p>
                    <p>
                        Stephanie, the "mom" in our venture comes from a nursing
                        background, spening most of her professional career in
                        Seattle before moving down to Phoenix for spicier food
                        and weather.
                    </p>
                    <p>
                        Travis, the "pop" in our venture comes from an
                        engineering background, tinkering with electronics,
                        building software enterprises, and cooking amazing
                        feasts for his family as a special weekly tradition.
                    </p>
                    <p>
                        So why the food service industry? We both believe that
                        the best discussions to be had, connections to be
                        created, and memories to be cherished happen when
                        breaking bread with those you love.
                    </p>
                    <blockquote>
                        <p>
                            "The important thing is not being afraid to take a
                            chance. Remember, the greatest failure is to not
                            try. Once you find something you love to do, be the
                            best at doing it."
                        </p>
                        <footer>
                            - Debbi Fields, founder of Mrs. Fields Cookies
                        </footer>
                    </blockquote>
                    <p>
                        While neither of our background are in food service, we
                        thought it was important to go on this adventure,
                        sharing our journey with you.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="content">
                    <h2 className="title is-3">Our Values</h2>
                    <div className="box">
                        <h3 className="title is-4">Transparency</h3>
                        <p>
                            Open and honest discussions create healthy
                            community.
                        </p>
                    </div>
                    <div className="box">
                        <h3 className="title is-4">Integrity</h3>
                        <p>
                            Keeping it real and doing the right thing, no matter
                            what.
                        </p>
                    </div>
                    <div className="box">
                        <h3 className="title is-4">Inclusivity</h3>
                        <p>
                            Celebrating diversity and making sure everyone feels
                            at home.
                        </p>
                    </div>
                    <div className="box">
                        <h3 className="title is-4">Sustainability</h3>
                        <p>
                            Committed to protecting our planet and promoting
                            eco-friendly practices.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
