  class App {

	//initialize
   constructor() {
    this.accounts = []; 
    this.member = {}
    this.loggedIn = false;

  }

  	//clear login info
  	logout() {
  		this.loggedIn = false;
  		Toolbox.store('currentUser', undefined, true);
  		Toolbox.store('currentMember', undefined, true);
  		Toolbox.store(this.member.memberId, undefined, true);
  	}

  	//login a user
    login(userid, passwd) {
    	this.loggedIn = false;
    	let user = Toolbox.getFromStorage('currentUser', true);
    	//console.log(user);

  		if (user) { 
  			//validate login
  			if (user.passwd == passwd && user.userid == userid) {
  				alert('Welcome back!');
  				this.loggedIn = true;
  			} 
  		}
		
		//not logged in 
		if (!this.loggedIn)
			Toolbox.assert(App.Account().msg.invalidLogin)
  	}

  	//save login info to session
  	setLoginedInUser(userid, passwd) {
  		this.loggedIn = true;
  		 Toolbox.store('currentUser', {'userid': userid, 'passwd':passwd}, true);
  	} 


	//a member can have multiple accounts, but this version we assume only 
	//one account per member 
	getMemberAccounts() {
		//fetch accounts for member
		//this.accounts = this.getAccountsForMember(memberId); 	
		return Toolbox.getFromStorage(this.member.memberId,true);
	}

	getLoggedInMember() {
		//fetch accounts
		return Toolbox.getFromStorage('currentMember',true);
	}

	addMember(fname,  lname, age, ssnum, userid, passwd) {
		//add member
		this.member = {
			'userid': userid, // email address
			'passwd': passwd,	
			'fname':fname,
			'lname':lname,
			'age':age,
			'ssnum': ssnum,
			'createdOn': Toolbox.getDateInMiliseconds(),
			'modifiedOn': Toolbox.getDateInMiliseconds()
		}

		//generate member id
		this.member.memberId = this.generateMemberId(lname, age, ssnum); 

		//save to backend db .. use local storage for now
		this.saveMember();

		//log the uer into the system
		this.setLoginedInUser(userid, passwd); //pass stored here temporarily, wont do this in prod version of course 

		//save the current member id
		this.saveMemberId();

		//return so we can use it in the app
		return this.member;
	}

	//create an account for a member
	addAccount(memberId, initialDeposit, timeframe, investmTarget, perfFee, mgmtFee) {
		//generate account id
		let accountId = this.generateAccountId(memberId, timeframe);
		//create the account	
		let investmAcct = new InvestmentAccount(accountId, initialDeposit, timeframe, investmTarget, perfFee, mgmtFee);

		//add to account list
		this.accounts.push(investmAcct);

		//save to backend db
		this.saveAccount();

		//return so we can use it in the app
		return investmAcct;
	}

	//add backend storage later
	//save the accounts
	saveAccount(){

		// Save all member accounts to sessionStorage
		Toolbox.store(this.member.memberId, this.accounts, true);
	}

	//save the member ..add backend storage later
	saveMember(){
		// Save member to sessionStorage
		Toolbox.store('currentMember', this.member, true);
	}

	//save the memberId , so we can retrieve the member and their accounts later 
	saveMemberId(){
		// Save membeId to sessionStorage
		Toolbox.store('memberId', this.member.memberId,true);
	}

	//generate account id
	generateAccountId(memberId, timeframe) {
			return memberId  + "tf" + timeframe;  	
	}

	//generate member id
	generateMemberId(lname, age, ssnum) {
			return lname + age + ssnum.slice(-4) +
				Math.floor(Math. random() * 101010) ; //add some randum number 	
	}

	//is the account active
	/*isActive(account) { 	
		//make sure account is acive
		return account.active;  
    	//Toolbox.assert(App.Account().msg.inactiveAccount);
    }

    //was performace objective achieved
    get hasCredit() {
    	return account._hasCredit;
    }*/

    //deduct account fees
    deductFee(account) {
    	if (!account.active) 
    		Toolbox.assert(App.Account().msg.inactiveAccount); 

    	if (!account.hasCredit) 
    		Toolbox.assert(App.Account().msg.noCreditAvailable); 
    	

    	//return total fee deducted   	
    	return account.deductFee();

    }
        
	//account message
	static Account() {
	   return {
	     'msg' : {
		  'insufficientFunds': 'You have insufficient funds',
	 	  'invalidAccountId': 'invalid Account Id',
		  'invalidFundValue': 'invalid Fund value',
	      'feeDeductionError': 'fee Deduction Error',
	      'inactiveAccount': 'inactive Account',
	      'noCreditAvailable': 'no Credit Available',
	      'invalidLogin': 'invalid Login'
	  	}
	   }
	}
}
//end of App class


//funds time frame, target, % retuen and fee structure
 var InvestToolsFund = {
	'timeframe': [90,180,365], // investment period in days
	'investmTarget': [5,10,15], //expected % return  
	'perfFee' : [2,4,6], //performace fee %
	'mgmtFee' :[.5,1,1.5]  //management fee %
}
