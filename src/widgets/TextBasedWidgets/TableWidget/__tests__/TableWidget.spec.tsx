// For accessing the prosemirror element
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import { fireEvent, screen } from '@testing-library/react';
import { renderWidget, mockSetActiveWidget, mockLoadWidgetToInfograph } from 'utils/test-utils.test';
import { TableWidget } from '../TableWidget';
import { generateDefaultData } from '../TableWidget.helpers';

// TODO: find a way to type text in the table widget and test this

describe('widgets/TableWiddget', () => {
  it('The table can be set as editable', () => {
    const widgetId = '008.widget-1';
    const widget = { widgetId, ...generateDefaultData() };
    const { container } = renderWidget(<TableWidget />, { widget });

    mockSetActiveWidget(widgetId);
    // default toolbar should be visible
    const widthSelect = screen.getByLabelText('Border Width');
    expect(widthSelect).toBeInTheDocument();

    const tableWidget = screen.getAllByTestId(/widgetbase/)[0];

    // 1st click => widget should be active
    // expect contenteditable to be false
    fireEvent.click(tableWidget);
    const TableEditor = container.querySelector('.ProseMirror');
    expect(TableEditor).toHaveAttribute('contenteditable', 'false');

    // 2nd click => widget should be editable
    fireEvent.click(TableEditor);
    expect(TableEditor).toHaveAttribute('contenteditable', 'true');

    // edit toolbar should be visible
    const cellColor = screen.getByLabelText('Cell color');
    expect(cellColor).toBeInTheDocument();
    expect(widthSelect).not.toBeInTheDocument();
  });

  it('Should set border width from toolbar', async () => {
    const widgetId = '008.widget-1';
    const widget = { widgetId, ...generateDefaultData() };
    const { container } = renderWidget(<TableWidget />, { widget });

    mockLoadWidgetToInfograph(widget);
    mockSetActiveWidget(widgetId);

    const widthSelect = screen.getByLabelText('Border Width');
    fireEvent.change(widthSelect, { target: { value: '3px' } });

    const table = container.querySelector('table th');
    expect(table).toHaveStyle('border-width: 3px');
  });
});
