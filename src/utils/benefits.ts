export class Benefits {

    static readonly PAYCHECKS_AMOUNT: number = 26
    static readonly BASE_PAYCHECK: number = 2000;
    static readonly EMPLOYEE_COST: number = 1000
    static readonly DEPENDANT_COST: number = 500

    static salary(paycheck: number = Benefits.BASE_PAYCHECK): number {
        return Benefits.PAYCHECKS_AMOUNT * paycheck
    }

    static benefitsCostsYearly(dependants: number): number {
        return Benefits.EMPLOYEE_COST + dependants * Benefits.DEPENDANT_COST
    }

    static benefitsCostsPerPaycheck(dependants: number): number {
        return Benefits.benefitsCostsYearly(dependants) / Benefits.PAYCHECKS_AMOUNT
    }

    static net_paycheck(dependants: number, paycheck: number = Benefits.BASE_PAYCHECK): number {
        return paycheck - this.benefitsCostsPerPaycheck(dependants)
    }

}