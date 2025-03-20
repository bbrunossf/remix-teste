//uso do property pane
import { PropertyPane } from './property-pane';

const LoadingAnimation = () => {
    let ganttInstance = useRef(null);
    let filterType = [
        { text: 'Shimmer', value: 'Shimmer' },
        { text: 'Spinner', value: 'Spinner' }
    ];
    const onChange = (sel) => {
        let type = sel.value.toString();
        if (type === "Shimmer") {
            ganttInstance.current.loadingIndicator.indicatorType = "Shimmer";
            ganttInstance.current.enableVirtualMaskRow = true;
            ganttInstance.current.refresh();
        }
        else {
            ganttInstance.current.loadingIndicator.indicatorType = "Spinner";
            ganttInstance.current.enableVirtualMaskRow = false;
            ganttInstance.current.refresh();
        }
    };

 <div className='col-md-3 property-section'>
        <PropertyPane title='Properties'>
          <table id='property' title='Properties' className='property-panel-table' style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', paddingLeft: 0 }}>
                <div style={{ paddingTop: '10px', paddingLeft: 0 }}> Indicator Type </div>
              </td>
              <td style={{ width: '70%' }}>
                <div>
                  <DropDownListComponent width="113px" id="seltype" change={onChange.bind(this)} dataSource={filterType} value="Shimmer"/>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </PropertyPane>
      </div>