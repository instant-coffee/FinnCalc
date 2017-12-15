class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      depositAmount: 0, 
      yearsInvested: 10,
      roi: 6,
      inflation: 2,
      currentTaxRate: 15,
      retirementTaxRate: 0,

      nominalFutureValue: 0,
      inflationFutureValue: 0,
      
      rrspTaxRefund: 0,
      rrspWithdrawalTaxValue: 0,
      rrspFutureValueAfterTax: 0,
      
      tfsaTaxRefund: 0,
      tfsaWithdrawalTaxValue: 0,
      tfsaFutureValueAfterTax: 0,
      tfsaWithTaxRefundFutureValueAfterTax: 0,

      rrspWithTaxRefundFutureValueAfterTax: 0,
      tfsaWithTaxRefunFutureValueAfterTax: 0,

    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.calculateFutureValue = this.calculateFutureValue.bind(this);
    this.calculateRateOfReturn = this.calculateRateOfReturn.bind(this);
    this.calculateTax = this.calculateTax.bind(this);
    this.calculateRRSPWithTaxRefund = this.calculateRRSPWithTaxRefund.bind(this);

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // future value calculated without inflation
    let nominalFutureValue = this.calculateFutureValue(this.state.depositAmount, this.state.roi, this.state.yearsInvested);

    // rate calculated, adjusting for inflation
    let rateOfReturn = this.calculateRateOfReturn(this.state.roi, this.state.inflation);
    let inflationFutureValue = this.calculateFutureValue(this.state.depositAmount, rateOfReturn, this.state.yearsInvested);

    // calculate RRSP values with taxes (will recieve tax refund but will pay when withdrawn)
    let rrspTaxRefund = this.calculateTax(this.state.depositAmount, this.state.currentTaxRate);
    let rrspWithdrawalTaxValue = this.calculateTax( nominalFutureValue, this.state.retirementTaxRate);
    let rrspFutureValueAfterTax = nominalFutureValue - rrspWithdrawalTaxValue;
    let rrspWithTaxRefundFutureValueAfterTax = this.calculateRRSPWithTaxRefund();

    // TFSA values (no tax refund and does not pay taxes)
    let tfsaFutureValueAfterTax = nominalFutureValue;

    this.setState({ 
      [name]: value,  // input values

      rrspTaxRefund: rrspTaxRefund,
      rrspWithdrawalTaxValue: rrspWithdrawalTaxValue,
      rateOfReturn: rateOfReturn,
      inflationFutureValue: inflationFutureValue,
      rrspWithTaxRefundFutureValueAfterTax: rrspWithTaxRefundFutureValueAfterTax,
      rrspFutureValueAfterTax: rrspFutureValueAfterTax,
      tfsaFutureValueAfterTax: nominalFutureValue,
      tfsaWithTaxRefundFutureValueAfterTax: nominalFutureValue,

      nominalFutureValue: nominalFutureValue,
    });
  }

  // http://www.financeformulas.net/Compound_Interest.html
  calculateFutureValue(initialBalance, intrestRate, numberOfPeriods) {
    return initialBalance * Math.pow(1 + (intrestRate / 100), numberOfPeriods)
  }

  // http://www.financeformulas.net/Real_Rate_of_Return.html
  calculateRateOfReturn(roi, inflationRate) {
    return (((1 + (roi / 100)) / (1 + (inflationRate / 100))) - 1) * 100;
  }

  calculateTax(amount, rate) {
    return amount * (rate / 100);
  }

  // Calculates the approx future value of the RRSP with tax refund is also invested.
  calculateRRSPWithTaxRefund() {
    let rrspWithTaxRefundDepositAmount = this.state.depositAmount + this.state.rrspTaxRefund;
    let rrspWithTaxRefundFutureValue = this.calculateFutureValue(rrspWithTaxRefundDepositAmount, this.state.roi, this.state.yearsInvested);
    let rrspWithTaxRefundWitdrawalTaxValue = this.calculateTax(rrspWithTaxRefundFutureValue, this.state.retirementTaxRate);

    return rrspWithTaxRefundFutureValue - rrspWithTaxRefundWitdrawalTaxValue;
  }

  render() {
    return (
      <section>
        <form>
          <div className="input__wrapper">
            <label>
              Deposit Amount
              <input type="number" 
                name="depositAmount"
                value={this.state.depositAmount}
                onChange={this.handleInputChange} 
                />
            </label>
          </div>

          <div className="input__wrapper">
            <label>
              Years Invested
              <input type="number"
                name="yearsInvested"
                value={this.state.yearsInvested}
                onChange={this.handleInputChange}
              />
            </label>
          </div>

          <div className="input__wrapper">        
            <label>
              Return on Investment
              <input type="number"
                name="roi"
                value={this.state.roi}
                onChange={this.handleInputChange}
              />
            </label>
          </div>


          <div className="input__wrapper">
            <label>
              Inflation Rate
              <input type="number"
                name="inflation"
                value={this.state.inflation}
                onChange={this.handleInputChange}
              />
            </label>
          </div>
            
          <div className="input__wrapper">
            <label>
              Current Marginal Tax Rate
              <input type="number"
                name="currentTaxRate"
                value={this.state.currentTaxRate}
                onChange={this.handleInputChange}
              />
            </label>
          </div>
          
          
          <div className="input__wrapper">
            <label>
              Average Tax Rate in Retirement
              <input type="number"
                name="retirementTaxRate"
                value={this.state.retirementTaxRate}
                onChange={this.handleInputChange}
              />
            </label>
          </div>

          <style jsx> {`
            .input__wrapper {
              padding: 1rem;
            }
            input {
              margin-left: 2rem;
            }
          `}
          </style>

        </form>

        <div className="output">

          <h2>FUTURE VALUE: { this.state.nominalFutureValue.toFixed(2) }</h2> 
          <h4>(Adjusted for Inflation): ${ this.state.inflationFutureValue.toFixed(2) }</h4> 

          <h3>Tax Refund:</h3>
          <div className="output__wrapper">
            <h4>RRSP: { this.state.rrspTaxRefund.toFixed(2) } $</h4>
            <h4>TFSA: { this.state.tfsaTaxRefund.toFixed(2) } $</h4>
          </div>

          <h3>Tax Due on Withdrawal:</h3>
          <div className="output__wrapper">
            <h4>RRSP: {this.state.rrspWithdrawalTaxValue.toFixed(2) } $</h4>
            <h4>TFSA: {this.state.tfsaWithdrawalTaxValue.toFixed(2) } $</h4>
          </div>


          <h3>Future Value:</h3>
          <div className="output__wrapper">
            <h4>RRSP: { this.state.rrspFutureValueAfterTax.toFixed(2) } $</h4>
            <h4>TFSA: { this.state.tfsaFutureValueAfterTax.toFixed(2) } $</h4>
          </div>

  
          <h3>Future Value with invested tax refund:</h3>
          <div className="output__wrapper">
            <h4>RRSP: { this.state.rrspWithTaxRefundFutureValueAfterTax.toFixed(2) } $</h4>
            <h4>TFSA: { this.state.tfsaWithTaxRefundFutureValueAfterTax.toFixed(2) } $</h4>
          </div>

          <style jsx> {`
            form {
              width: 40%;
            }
            .output {
              background-color: #cfcfcf;
              padding: 1.5rem 3rem;
            }
            .output__wrapper {
              background-color: #fff;
              border-radius: 5px;
              padding: 1rem;
            }
          `}
          </style>

        </div>
      </section>
    );
  }
}

export default Calculator