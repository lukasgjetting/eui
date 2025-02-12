import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  EuiBadge,
  EuiRadioGroup,
  EuiSpacer,
  EuiSwitch,
  EuiPanel,
  EuiText,
  EuiTitle,
} from '../../../../src/components';
import { find } from 'lodash';
import { BarSeries, LineSeries, AreaSeries } from '@elastic/charts';

export const CHART_COMPONENTS = {
  BarSeries: BarSeries,
  LineSeries: LineSeries,
  AreaSeries: AreaSeries,
};

export const ExternalBadge = () => {
  return (
    <EuiBadge
      iconType="popout"
      iconSide="right"
      onClickAriaLabel="Go to elastic-charts docs"
      onClick={() =>
        window.open('https://github.com/elastic/elastic-charts/tree/v17.0.2')
      }>
      External library: elastic-charts v17.0.2
    </EuiBadge>
  );
};

export const ChartCard = ({ title, description, children }) => {
  return (
    <EuiPanel>
      <EuiTitle size="s">
        <span>{title}</span>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiText size="s">
        <p>{description}</p>
      </EuiText>
      <EuiSpacer size="s" />
      {children}
    </EuiPanel>
  );
};

// eslint-disable-next-line react/no-multi-comp
export class ChartTypeCard extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    mixed: PropTypes.oneOf(['enabled', 'disabled', true, false]),
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.idPrefix = 'chartType';

    this.toggleButtonsIcons = [
      {
        id: `${this.idPrefix}0`,
        label: 'BarSeries',
      },
      {
        id: `${this.idPrefix}1`,
        label: 'LineSeries',
      },
      {
        id: `${this.idPrefix}2`,
        label: 'AreaSeries',
      },
    ];

    this.state = {
      toggleIdSelected: `${this.idPrefix}0`,
    };
  }

  onChartTypeChange = optionId => {
    this.setState({
      toggleIdSelected: optionId,
    });

    const chartType = find(this.toggleButtonsIcons, { id: optionId }).label;
    this.props.onChange(chartType);
  };

  render() {
    if (this.props.mixed) {
      this.toggleButtonsIcons[3] = {
        id: `${this.idPrefix}3`,
        label: 'Mixed',
        disabled: this.props.mixed === 'disabled',
      };
    }

    return (
      <ChartCard
        title="Chart types"
        description={`${
          this.props.type
        } charts can be displayed as any x/y series type.`}>
        <EuiRadioGroup
          compressed
          options={this.toggleButtonsIcons}
          idSelected={this.state.toggleIdSelected}
          onChange={this.onChartTypeChange}
          disabled={this.props.disabled}
        />
      </ChartCard>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export class MultiChartCard extends Component {
  static propTypes = {
    /**
     * Returns (multi:boolean, stacked:boolean)
     */
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      multi: false,
      stacked: false,
    };
  }

  onMultiChange = e => {
    const stacked = e.target.checked ? this.state.stacked : false;

    this.setState({
      multi: e.target.checked,
      stacked,
    });

    this.props.onChange({
      multi: e.target.checked,
      stacked,
    });
  };

  onStackedChange = e => {
    this.setState({
      stacked: e.target.checked,
    });

    this.props.onChange({ multi: this.state.multi, stacked: e.target.checked });
  };

  render() {
    return (
      <ChartCard
        textAlign="left"
        title="Single vs multiple series"
        description="Legends are only necessary when there are multiple series. Stacked series indicates accumulation but can hide subtle differences. Do not stack line charts.">
        <EuiSwitch
          label="Show multi-series"
          checked={this.state.multi}
          onChange={this.onMultiChange}
        />
        <EuiSpacer size="s" />
        <EuiSwitch
          label="Stacked"
          checked={this.state.stacked}
          onChange={this.onStackedChange}
          disabled={!this.state.multi}
        />
      </ChartCard>
    );
  }
}
