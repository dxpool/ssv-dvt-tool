import { useState, useEffect, useContext } from "react";
// mui
import { DataGrid, GridColDef, GridCellParams, GridRowParams, GridComparatorFn } from "@mui/x-data-grid";
import { Avatar, Tooltip } from "@mui/material";
import { InfoOutlined, LockOutlined } from "@mui/icons-material";

// contexts
import { GlobalContext } from "../GlobalContext";
import { KeyCreationContext } from "../KeyCreationContext";

// css, constants, config, types and components
import "../components.css"
import MevRelayerTooltipComponent from "./MevRelayerTooltip";
import { sortOperatorFunction } from "../utils";
import { VERIFIED, DKG_ENABLED, SSV_EXCHANGE, VERIFIED_OPERATOR } from "../constants";
import { LowerCaseNetwork } from "../types";
import { OperatorRequestParams } from "../modals/SyncOperatorModal";
import { getCachedImage } from "../utils/imageCache";

const mevRelaysComparator: GridComparatorFn<string> = (v1, v2) => {
  const count1 = v1 ? v1.split(',').length : 0;
  const count2 = v2 ? v2.split(',').length : 0;
  return count1 - count2;
};

type OperatorTableProps = {
  onOperatorSelection: (data: any[]) => void;
  selectedClusterSize: number;
  selectedOperators: any;
  searchValue: string;
  filterValue: any
};

export default function operatorTable({ onOperatorSelection, selectedClusterSize, selectedOperators, searchValue, filterValue }: OperatorTableProps) {
  const [operators, setOperators] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState<any[]>([]);
  const [selectionModel, setSelectionModel] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { numberOfKeys } = useContext(KeyCreationContext);
  const { network, operatorList } = useContext(GlobalContext);
  const [cachedImages, setCachedImages] = useState<Record<string, string>>({});

  const columns: GridColDef[] = [
    {
      minWidth: 230,
      headerName: 'Name',
      field: 'name',
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const cachedLogo = cachedImages[`${params.row.network}-${params.row.id}`] || params.row.logo;

        return (
          <div className="tw-flex tw-items-center" style={{ lineHeight: '26px', margin: '4px 0' }}>
            <Avatar
              alt="logo"
              src={cachedLogo}
              sx={{ width: 32, height: 32 }}
            />
            <div className="tw-ml-2">
              <div className="tw-flex tw-items-center">
                <div className="tw-text-white tw-mr-2">{params.row.name}</div>
                {params.row.address_whitelist !== '' ? (
                  <Tooltip title="Private Operator">
                    <LockOutlined sx={{ height: 18, width: 18, cursor: 'pointer' }} />
                  </Tooltip>
                ) : null}
              </div>
              <div className="tw-text-grayText">ID: {params.row.id}</div>
            </div>
          </div>
        );
      }
    },
    {
      minWidth: 150,
      headerName: 'Validators',
      field: 'validators_count',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      renderCell: (params: GridCellParams) => (
        <div className="tw-flex tw-items-center">
          <div className="tw-mr-2">{params.row.validators_count}</div>
          {params.row.validators_count + numberOfKeys >= 500 && params.row.network === LowerCaseNetwork.MAINNET || params.row.validators_count + numberOfKeys >= 560 && params.row.network === LowerCaseNetwork.HOLESKY ? (
            <Tooltip title="Operator reached maximum amount of validators">
              <InfoOutlined sx={{height: 18, width: 18, cursor: 'pointer'}} />
            </Tooltip>
          ) : null}
        </div>
      )
    },
    {
      minWidth: 180,
      headerName: '30d performance',
      field: '30d',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params: GridCellParams) => (
        params.row.validators_count === 0 ? (
          <div style={{ lineHeight: '26px', margin: '4px 0' }}>
            <div>{params.row['30d'].toFixed(2)} %</div>
            <div className="tw-text-center tw-rounded-md tw-text-black tw-bg-[#e6eaf7] tw-px-2 tw-w-24">No Validator</div>
          </div>
        ) : params.row.is_active === 0 ? (
          <div style={{ lineHeight: '26px', margin: '4px 0' }}>
            <div className="tw-text-darkRed ">{params.row['30d'].toFixed(2)} %</div>
            <div className="tw-text-center tw-rounded-md tw-text-darkRed tw-bg-[#fbe7e7] tw-px-2 tw-w-20">Inactive</div>
          </div>
        ) : <div>{params.row['30d'].toFixed(2)} %</div>
      ),
    },
    {
      minWidth: 140,
      headerName: 'Yearly Fee',
      field: 'fee',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      renderCell: (params: GridCellParams) => (
        <div>
          {(Number(params.row.fee) / SSV_EXCHANGE).toFixed(2)} SSV
        </div>
      ),
    },
    {
      minWidth: 180,
      headerName: 'MEV',
      field: 'mev_relays',
      headerAlign: 'center',
      sortComparator: mevRelaysComparator,
      renderCell: (params: GridCellParams) => {
        const mevRelays = params.row.mev_relays as string;
        return (
          <div className="tw-mt-5">
            <MevRelayerTooltipComponent mevRelays={mevRelays} />
          </div>
        )
      },
    }
  ];

  useEffect(() => {
    // when selectedClusterSize/selectedOperators changes, update the selectionModel
    const filteredOperatorIds = Object.keys(selectedOperators).map(key => parseInt(key));

    setSelectionModel(filteredOperatorIds);
  }, [selectedClusterSize, selectedOperators]);

  useEffect(() => {
    const params: OperatorRequestParams = {
      network: network,
    };

    if (filterValue.includes(VERIFIED)) {
      params.type = VERIFIED_OPERATOR;
    }

    if (filterValue.includes(DKG_ENABLED)) {
      params.has_dkg_address = true;
    }

    if (searchValue) {
      params.search = searchValue;
    }

    getCachedOperators(params);
    
    loadCachedImages();
  }, [searchValue, filterValue]);

  const loadCachedImages = async () => {
    const images: Record<string, string> = {};
    for (const item of operatorList) {
      const cachedImage = await getCachedImage(item.id, item.network);
      if (cachedImage) {
        images[`${item.network}-${item.id}`] = cachedImage;
      }
    }
    setCachedImages(images);
  }

  const handlePaginationModelChange = (paginationModel: any) => {
    setCurrentPage(paginationModel.page);
  }

  // Utility function to get default selected rows
  const getDefaultSelectedRows = () => {
    const defaultOperator = operatorList
      .filter((operator: any) => operator.name.includes('DxPool') && operator.is_active === 1)
      .reduce((minOperator: any, currentOperator: any) => {
        return currentOperator.validators_count < minOperator.validators_count ? currentOperator : minOperator;
      }, { validators_count: Infinity });
  
    return defaultOperator.validators_count !== Infinity ? [defaultOperator.id] : [];
  };

  // Utility function to check if default selected rows are unselected
  const isDefaultRowUnselected = (selection: any[], defaultSelectedRows: any[]) => {
    return defaultSelectedRows.some(defaultId => !selection.includes(defaultId));
  };

  // Utility function to get inactive operators
  const getInactiveOperators = () => {
    return operators
      .filter((row: any) => row.is_active === 0 && row.validators_count > 0)
      .map((row: any) => row.id);
  };

  // Utility function to check if selection contains inactive operators
  const hasInactiveOperator = (selection: any[], inactiveOperators: any[]) => {
    return selection.some((id: any) => inactiveOperators.includes(id));
  };

  // Utility function to get operators with maximum validators count
  const getOperatorsWithMaximumValidators = () => {
    return operators
      .filter((row: any) => 
        (row.validators_count + numberOfKeys >= 500 && row.network === LowerCaseNetwork.MAINNET) ||
        (row.validators_count + numberOfKeys >= 560 && row.network === LowerCaseNetwork.HOLESKY)
      )
      .map((row: any) => row.id);
  };

  // Utility function to check if selection contains operators with maximum validators count
  const hasMaximumValidator = (selection: any[], maximumValidators: any[]) => {
    return selection.some((id: any) => maximumValidators.includes(id));
  };

  /**
   * Handles changes in row selection.
   *
   * @param {any[]} selection - The array of selected row identifiers.
   *
   * This function performs several checks before updating the selection:
   * 1. It checks if the default selected rows are unselected.
   * 2. It ensures the selection does not exceed the allowed cluster size.
   * 3. It verifies that the selection does not contain inactive operators.
   * 4. It checks if the selection includes operators with the maximum validators count.
   *
   * If any of these conditions are met, the function returns early without making changes.
   *
   * If all checks pass, the function updates the selection model and selected row data,
   * and then calls the `onOperatorSelection` callback with the new selected row data.
  */
  const handleRowSelectionChange = (selection: any[]) => {
    const defaultSelectedRows = getDefaultSelectedRows();

    // Check if default selected rows are unselected
    if (isDefaultRowUnselected(selection, defaultSelectedRows)) return;

    // Check if the selection exceeds the allowed cluster size
    if (selection.length > selectedClusterSize) return;
  
    // Get inactive operators
    const inactiveOperators = getInactiveOperators();
    // Check if the selection contains inactive operators
    if (hasInactiveOperator(selection, inactiveOperators)) return;
  
    // Get operators with maximum validators count
    const maximumValidators = getOperatorsWithMaximumValidators();
    // Check if the selection contains operators with maximum validators count
    if (hasMaximumValidator(selection, maximumValidators)) return;

    // Update the selection model
    setSelectionModel(selection);
  
    // Update the selected row data
    const selectedIDs = new Set(selection);
    const newSelectedRowData = [
      ...selectedRowData.filter(row => selectedIDs.has(row.id)),
      ...operators.filter((row: any) => selectedIDs.has(row.id))
    ];
  
    setSelectedRowData(newSelectedRowData);
  
    // Handle operator selection
    onOperatorSelection(newSelectedRowData);
  };

  /**
   * Retrieves and filters a list of operators based on the user synced at first step,
   * sorts the filtered operators
   *
   * @param {OperatorRequestParams} params - The parameters used for filtering and sorting operators.
   * @param {string} [params.type] - The type of operators to filter by.
   * @param {string} [params.search] - A search term to filter operators by name, twitter_url, or description.
   * @param {boolean} [params.has_dkg_address] - A flag to filter operators that have a non-null and non-empty dkg_address.
  */
  const getCachedOperators = (params: OperatorRequestParams) => {
    if (!operatorList) return;

    setIsLoading(true);
    try {
      let filterOperatorData = [...operatorList]

      // filter and sort operators based on the params
      if (params.type) {
        filterOperatorData = filterOperatorData.filter((operator: any) => operator.type === params.type);
      }

      if (params.search) {
        const searchValue = params.search;
        let lowerCaseSearchValue: string | null = null;
      
        // Check if params.search is a string
        if (typeof searchValue === 'string') {
          lowerCaseSearchValue = searchValue.toLowerCase();
        }
      
        filterOperatorData = filterOperatorData.filter((operator: any) => {
          const operatorName = operator.name.toLowerCase();
          const operatorId = operator.id_str;
      
          // Check for name match
          const isNameMatch = lowerCaseSearchValue ? operatorName.includes(lowerCaseSearchValue) : false;
          // Check for ID match
          const isIdMatch = operatorId.includes(searchValue);
      
          return isNameMatch || isIdMatch;
        });
      }

      if (params.has_dkg_address !== undefined) {
        filterOperatorData = filterOperatorData.filter((operator: any) => operator.dkg_address !== null && operator.dkg_address !== '');
      }

      let sortOperatorArray = filterOperatorData.sort(sortOperatorFunction) as any;
      setOperators(sortOperatorArray);

      const selectedIds = Object.keys(selectedOperators).map(key => parseInt(key));
      const validSelection = selectedIds.filter(id => sortOperatorArray.some((operator: any) => operator.id === id));
      setSelectionModel(validSelection);
    } catch {
      setOperators([]);
      setSelectionModel([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: 500 }}>
      <DataGrid
        rows={operators}
        columns={columns}
        checkboxSelection
        pagination
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        paginationModel={{ page: currentPage, pageSize: 10 }}
        onPaginationModelChange={(paginationModel) => handlePaginationModelChange(paginationModel)}
        onRowSelectionModelChange={handleRowSelectionChange}
        rowSelectionModel={selectionModel}
        isRowSelectable={(params: GridRowParams) => !params.row.address_whitelist}
        loading={isLoading}
        rowHeight={68}
        disableColumnResize
        disableRowSelectionOnClick
        sx={{
          fontWeight: 600,
          background: '#303136',
          border: 0,
        }}
      />
    </div>
  );
}