const assert = require('assert');

const SettingsBill = require('../settings');
const settingsBill = SettingsBill();

describe('The call radio button...', function () {

    // const settingsBill = SettingsBill();

    it('...should record a single call cost to the total call cost field after the add button is pressed', function () {
        settingsBill.recordAction('call');
        assert.equal(1, settingsBill.actionsFor('call').length);
    });

    it('...should record R5 at the total call cost field when the set call cost is R2.50', function () {
        settingsBill.recordAction('call');
        assert.equal(2, settingsBill.actionsFor('call').length);
    });

    it('...should record R15 at the total call cost field when clicked thrice & the set call cost is R5', function () {
        settingsBill.recordAction('call');
        assert.equal(3, settingsBill.actionsFor('call').length);
    });
});


describe('The sms radio button...', function () {

    // const settingsBill = SettingsBill();

    it('...should record R4 at the total call cost field when the set sms cost is R1 and four calls were made', function () {
        settingsBill.recordAction('call');
        assert.equal(4, settingsBill.actionsFor('call').length);
    });

    it('...should record R5 at the total sms cost field when clicked 5 times & the set call cost is R1', function () {
        settingsBill.recordAction('call');
        assert.equal(5, settingsBill.actionsFor('call').length);
    });

});

describe('The settings-bill web app...', function () {

    // const settingsBill = SettingsBill();

    it('... should be able to set the settings of R2.35, R3.35, R10 & 20 for sms, call, warning and critical levels respectfully after the update settings button is clicked ', function () {
        settingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 10,
            criticalLevel: 20
        });

        assert.deepEqual({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 10,
            criticalLevel: 20
        }, settingsBill.getSettings())


    });

    it('...should calculate the total of R5.70 if a call and sms was made with set costs of R2.35 and R3.35 respectively', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(2.35, settingsBill.totals().smsTotal);
        assert.equal(3.35, settingsBill.totals().callTotal);
        assert.equal(5.70, settingsBill.totals().grandTotal);

    });


    it('...should calculate the total of R11.40 after making 2 calls and 2 smss while the set costs are R2.35 and R3.35 respectively', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(4.70, settingsBill.totals().smsTotal);
        assert.equal(6.70, settingsBill.totals().callTotal);
        assert.equal(11.40, settingsBill.totals().grandTotal);

    });

    it('...should give out the orange signal on the overall total cost when the warning level is reached', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedWarningLevel());
    });

    it('...should give out the red signal on the overall total cost when the critical level is reached', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedCriticalLevel());
    });
});