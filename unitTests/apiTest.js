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

/*describe('passwordresetrequest', () => {
    describe('/POST passwordresetrequest', () => {
        it('password reset has been sent to email', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/passwordresetrequest')
                .send(({Login: "userto",}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('passwordreset', () => {
    describe('/POST passwordreset', () => {
        it('password has been successfully reset/changed', (done) => {
            chai.request('https://nutrition-app-27.herokuapp.com')
                .post('/api/passwordreset')
                .send(({NewPassword: "passto2"}))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});*/

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