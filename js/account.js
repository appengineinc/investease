//base account class 
 class Account {

   //initialize
  constructor(id, funds) {
    //if (isNaN(id))
    //Toolbox.assert(App.Account().msg.invalidAccountId);   
    this._id = id;

    if (isNaN(funds))
      Toolbox.assert(App.Account().msg.invalidFundValue);

    this._initBalance = this.funds = funds;
    this._deposits = 0;
    this._active =  true;
    this.dateCreated = this.dateModified = Toolbox.getDateInMiliseconds();
       
  }

  //deposit funds
  deposit(deposit) {
   this.funds += deposit;
   this._deposits += deposit; 
  }
  //withdraw funds
  withdraw(withdrawAmount) {
   if (this.funds > withdrawAmount){
   	this.funds -= withdrawAmount;
    this._deposits -= withdrawAmount;
   }else
   	 Toolbox.assert(App.Account().msg.insufficientFunds);	    
  }

  //close account, and notify listeners
  close() {
   this._active = false;
   //publish this event to listeners
  }

  //get acct status
  get active() {
     return this._active;
  }

  //get account balance
  get balance() {
    return this.funds.toFixed(2); 
  }

  //initial account balance, used to calculate gain
  get initBalance() {
    return this._initBalance;
  }
  //get sum of all deposits made
  get deposits() {
     return this._deposits;
  }
  
  //get account id
  get id() {
     return this._id;
  }
  set id(id) {    
    this._id = id;
  }

                         
}                       

//investment account class
 class InvestmentAccount extends Account {
  constructor(accountId, initialDeposit, timeframe, investmTarget, perfFee, mgmtFee) {
    super(accountId,initialDeposit);
    this.timeframe = timeframe;
    this.investmTarget = investmTarget;
    this.perfFee = perfFee;
    this.mgmtFee = mgmtFee;
    this._acctCredit = 0;
    this._hasCredit = false;
  }

  //deposit made by hedge fund into member's account, 
  //after performance goal has been achieved
  creditAcct(acctCredit) {
      this._acctCredit = acctCredit;
      //super.deposit(deposit);     
  }

  //set acctCredit(acctCredit) {
  //    this._acctCredit = acctCredit;
  //}

  get acctCredit() {
    return this._acctCredit;
  }

  ///check this before deducting a fees
  get hasCredit() {
      this._hasCredit = this._acctCredit > 0;
      return this._hasCredit;
  }
 
  //year  to date performance
  getYtdPerformance() {
     //todo

  }

  //acct account performance in %
  getAcctPerformance() {
    if (this.acctPerformance > 0) 
      return (this.acctPerformance / this.balance ) * 100; 
    else
       return 0;
  }


  //reset account for each new performance period
  resetAccount() {
      
      //add acctCredit to account balance, 
      //this has to be done before any redemptions, and after 
      //all fees have been deducted
      super.deposit(this._acctCredit);

      //track cumulative value of funds deposited, 
      //so we can graph account performance over time
      this.acctPerformance += this._acctCredit;

      //zero out the acctCredit
      this._acctCredit = 0;

      //reset credit status
      this._hasCredit = false;
  }

  //deduct performance or management  fee, value in percent i.e .5
  //app need ot check is accout is acive before alling this method, done in App class
  deductFees() { 
    let totalFeeAmount = 0;
    
    //if (this.hasCredit) { // not needed as this check 
    //should be done on app layer by calling App.Account()Credited(account) 
	 	//deduct fee    
    try {

      //deduct performamce fee
      this._perfFeeAmount = this._acctCredit * (this.perfFee/100);

      //deduct management fee
      this._mgmtFeeAmount = this._acctCredit * (this.mgmtFee/100);

      //store tottal fees deducted
      this.totalFeesDeducted = this._perfFeeAmount + this._mgmtFeeAmount;

      //update the acctCredit amount by deducting the fees 
      this._acctCredit -= this.totalFeesDeducted;

      totalFeeAmount = this.totalFeesDeducted;
      
    } catch(e) {
        Toolbox.assert(App.Account().msg.feeDeductionError);
        Toolbox.log("deductFee - account:" + super.id ,e);  // log this error
    }
		
    //return fee amount to b ecredited to hedge fund 		   
	  return totalFeeAmount;
  }

  get getmgmtFeeAmount() {
      return this._mgmtFeeAmount; 
  }

  get perfFeeAmount(){
    return this._perfFeeAmount;
  }

  getTotalFeeAmount() {
     return this.totalFeesDeducted; 
  }




  
}