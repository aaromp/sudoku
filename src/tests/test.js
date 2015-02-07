var should = require('should');

var user = {
	name: 'aaron'
};

describe('test', function(){
  describe('user', function(){
    it('user should have a name', function(){
      user.should.have.property('name');
    });
  });
});
