let chai = require('chai');
let chaiHTTP = require('chai-http');
let should = chai.should();
let app = require('../server');
chai.use(chaiHTTP);

describe('register', () => {
    describe('/POST register', () => {
        it('credentials are entered and user is successfully registered', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/register')
                .send(({FirstName: "Jon", LastName: "Doe", Login: "jondoe3", Password: "password", Email: "jondoe123@gmail.com", Birthday: "12/27/1992"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('login', () => {
    describe('/POST login', () => {
        it('Valid credentials, successfully logged in', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/login')
                .send(({Login: "test", Password: "password"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('invalid username or password', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/login')
                .send(({Login: "h57dh37hfd8", Password: "fakepasswordlol"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('account has not been verified', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/login')
                .send(({Login: "just", Password: "chilling"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('addmeal', () => {
    describe('/POST addmeal', () => {
        it('meal successfully added', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/addmeal')
                .send(({UserId: "7", Name: "chicken test", Calories: "500", Protein: "42", Carbs: "80", Fat: "15", Fiber:"5", Sugar: "0", Sodium: "200", Cholesterol: "20"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('deletemeal', () => {
    describe('/DELETE deletemeal', () => {
        it('meal successfully deleted', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .delete('/api/deletemeal/625dc06b5180bb3dbfb90386')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('searchmeal', () => {
    describe('/GET searchmeal', () => {
        it('meal successfully found', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .get('/api/searchmeal/6257a1931c0e776bc83b35d6')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('editmeal', () => {
    describe('/PUT editmeal', () => {
        it('meal successfully edited', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .put('/api/editmeal/62548b8c6f332376d2ff9e50')
                .send(({Name: "chicken test", Calories: "500", Protein: "42", Carbs: "80", Fat: "15", Fiber:"5", Sugar: "0", Sodium: "200", Cholesterol: "20"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('filtersearch', () => {
    describe('/GET filtersearch', () => {
        it('meals containing given string successfully found', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .get('/api/filtersearch/7/chi')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('retrievegoal', () => {
    describe('/GET retrievegoal', () => {
        it('goals successfully retrieved for given user', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .get('/api/retrievegoal/8')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('editgoal', () => {
    describe('/PUT editgoal', () => {
        it('goal successfully edited', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .put('/api/editgoal/')
                .send(({UserId: "7", Calories: "500", Protein: "42", Carbs: "80", Fat: "15", Fiber:"5", Sugar: "0", Sodium: "200", Cholesterol: "20"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('trackmeal', () => {
    describe('/POST trackmeal', () => {
        it('meal successfully tracked', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/trackmeal/')
                .send(({UserId: "7", MealId: "62406f8021c2dab301052420", Category: "2", Quantity: "1", Date: "04/20/22"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('retrievetracked', () => {
    describe('/POST retrievetracked', () => {
        it('tracked meal successfully received', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/retrievetracked/')
                .send(({UserId: "7"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('deletetracked', () => {
    describe('/DELETE deletetracked', () => {
        it('tracked meal successfully deleted', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .delete('/api/deletemeal/62698bbc081ad916baf4d3d6')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('addweight', () => {
    describe('/POST addweight', () => {
        it('weight successfully added', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/addweight')
                .send(({UserId: "7", newWeight: "150", Date: "04/20/22"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('retrieveweights', () => {
    describe('/POST retrieveweights', () => {
        it('weight successfully received', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/retrievetracked/')
                .send(({UserId: "7"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('deleteweight', () => {
    describe('/DELETE deleteweight', () => {
        it('weight successfully deleted', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .delete('/api/deletemeal/626f07b091129f07dc123f4d')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});