import React, { PropTypes } from 'react';
import Header from './Header';
import Combobox from './Combobox';
import moment from 'moment';
import classNames from 'classnames';

function noop() {
}

function generateOptions(length, disabledOptions, hideDisabledOptions, step) {
  const arr = [];
  for (let value = 0; value < length; value += step) {
    if (!disabledOptions || disabledOptions.indexOf(value) < 0 || !hideDisabledOptions) {
      arr.push(value);
    }
  }
  return arr;
}

const Panel = React.createClass({
  propTypes: {
    clearText: PropTypes.string,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    defaultOpenValue: PropTypes.object,
    value: PropTypes.object,
    placeholder: PropTypes.string,
    format: PropTypes.string,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    hideDisabledOptions: PropTypes.bool,
    onChange: PropTypes.func,
    onEsc: PropTypes.func,
    allowEmpty: PropTypes.bool,
    showHour: PropTypes.bool,
    showSecond: PropTypes.bool,
    onClear: PropTypes.func,
    hourStep: PropTypes.number,
    minuteStep: PropTypes.number,
    secondStep: PropTypes.number,
    addon: PropTypes.func,
  },

  getDefaultProps() {
    return {
      prefixCls: 'rc-time-picker-panel',
      onChange: noop,
      onClear: noop,
      disabledHours: noop,
      disabledMinutes: noop,
      disabledSeconds: noop,
      defaultOpenValue: moment(),
      addon: noop,
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
      selectionRange: [],
    };
  },

  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;
    if (value) {
      this.setState({
        value,
      });
    }
  },

  onChange(newValue) {
    this.setState({ value: newValue });
    this.props.onChange(newValue);
  },

  onClear() {
    this.props.onClear();
  },

  onCurrentSelectPanelChange(currentSelectPanel) {
    this.setState({ currentSelectPanel });
  },

  close() {
    this.props.onEsc();
  },

  render() {
    const {
      prefixCls, className, placeholder, disabledHours, disabledMinutes,
      disabledSeconds, hideDisabledOptions, allowEmpty, showHour, showSecond,
      format, defaultOpenValue, clearText, onEsc,
      hourStep, minuteStep, secondStep, addon,
    } = this.props;
    const {
      value, currentSelectPanel,
    } = this.state;
    const disabledHourOptions = disabledHours();
    const disabledMinuteOptions = disabledMinutes(value ? value.hour() : null);
    const disabledSecondOptions = disabledSeconds(value ? value.hour() : null,
      value ? value.minute() : null);
    const hourOptions = generateOptions(24, disabledHourOptions, hideDisabledOptions,
      hourStep);
    const minuteOptions = generateOptions(60, disabledMinuteOptions, hideDisabledOptions,
      minuteStep);
    const secondOptions = generateOptions(60, disabledSecondOptions, hideDisabledOptions,
      secondStep);

    return (
      <div className={classNames({ [`${prefixCls}-inner`]: true, [className]: !!className })}>
        <Header
          clearText={clearText}
          prefixCls={prefixCls}
          defaultOpenValue={defaultOpenValue}
          value={value}
          currentSelectPanel={currentSelectPanel}
          onEsc={onEsc}
          format={format}
          placeholder={placeholder}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          onChange={this.onChange}
          onClear={this.onClear}
          allowEmpty={allowEmpty}
        />
        <Combobox
          prefixCls={prefixCls}
          value={value}
          defaultOpenValue={defaultOpenValue}
          format={format}
          onChange={this.onChange}
          showHour={showHour}
          showSecond={showSecond}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          onCurrentSelectPanelChange={this.onCurrentSelectPanelChange}
        />
        {addon(this)}
      </div>
    );
  },
});

export default Panel;
