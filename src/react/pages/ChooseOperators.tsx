import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
// self components
import WizardWrapper from "../components/WizardWrapper";
import OperatorSearch from "../components/OperatorSearch";
import OperatorTable from "../components/OperatorTable";
import MevRelayerTooltipComponent from "../components/MevRelayerTooltip";
// mui components
import { Button, Divider, Tooltip, TooltipProps, tooltipClasses, Menu, Avatar, IconButton, Checkbox, MenuItem, ListItemText, styled } from "@mui/material";
// material icons
import { FilterAltOutlined, Lock, Remove, ErrorOutline, KeyboardArrowLeft } from "@mui/icons-material";
// constants, css files, config files
import { DEFAULT_CLUSTER_SIZE, FILTER_OPTION, CreateMnemonicFlow, ExistingMnemonicFlow, paths, SSV_EXCHANGE, VERIFIED_OPERATOR } from "../constants";
import { NetworkTypeConfig } from "../../types.config";
import { LowerCaseNetwork } from "../types";
import { GlobalContext } from "../GlobalContext";
import "../components.css"

type ClusterSizeOption = {
  id: number;
  label: number;
  active: boolean;
};

/**
  * List that shows ssv operators and their public keys, let user to generate a cluster
  * User will slit the keystore that was generated before this step
 */
const ChooseOperators = () => {
  const history = useHistory();
  const usingExistingFlow = history.location.pathname === paths.CHOOSE_OPERATOR_EXISTING;

  const { network, operatorList } = useContext(GlobalContext);
  const networkKey = network.toLowerCase() as keyof NetworkTypeConfig;

  const defaultOperator = operatorList
  .filter((operator: any) => operator.name.includes('DxPool') && !operator.is_private)
  .reduce((minOperator: any, currentOperator: any) => {
    return currentOperator.validators_count < minOperator.validators_count ? currentOperator : minOperator;
  }, operatorList[0]);

  const [selectedClusterSize, setSelectedClusterSize] = useState(DEFAULT_CLUSTER_SIZE);
  const [selectedOperators, setSelectedOperators] = useState({ [defaultOperator.id]: defaultOperator });
  const [totalFee, setTotalFee] = useState(0);
  const [isMaximumValidator, setIsMaximumValidator] = useState(false);
  const [isUnVerifiedSelected, setIsUnVerifiedSelected] = useState(false);
  const [clusterSizeOptions, setClusterSizeOptions] = useState<ClusterSizeOption[]>([
    {id: 1, label: 4, active: true},
    {id: 2, label: 7, active: false},
    {id: 3, label: 10, active: false},
    {id: 4, label: 13, active: false},
  ]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState<string[]>([]);

  const sortedSelectedOperators = Object.values(selectedOperators).sort((a, b) => {
    if (a.id === defaultOperator.id) return -1;
    if (b.id === defaultOperator.id) return 1;
    return a.id - b.id;
  });

  const YearlyFeeTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#3F3F46',
      maxWidth: 480,
    },
  }));

  useEffect(() => {
    const operatorArray = Object.values(selectedOperators);
    
    // calculate total fee
    const total = operatorArray.reduce((accumulator, operator) => {
      const feeNumber = parseFloat(operator.fee);
      const ssvValue = (feeNumber / SSV_EXCHANGE).toFixed(2);
      return accumulator + parseFloat(ssvValue);
    }, 0);

    setTotalFee(total);

    // Check if any of the selected operators have reached their maximum validator capacity, mainnet is 500 and holesky/hoodi is 560
    const isMaximumValidator = operatorArray.some(operator => operator.validators_count > 500 && networkKey === LowerCaseNetwork.MAINNET || operator.validators_count > 560 && networkKey === LowerCaseNetwork.HOODI);
    setIsMaximumValidator(isMaximumValidator);

    // Check if any of the selected operators are unverified
    const isUnVerifiedSelected = operatorArray.some(operator => operator.type != VERIFIED_OPERATOR);
    setIsUnVerifiedSelected(isUnVerifiedSelected);
  }, [selectedOperators]);

  useEffect(() => {
    // ensure the selected operators are updated when the search value changes
    const data = Object.values(selectedOperators);

    // Remove duplicates
    const uniqueData = Array.from(new Set(data));

    handleOperatorSelection(uniqueData);
  }, [searchValue, filterValue]);
  
  const handleSearch = (value: string) => {
    // input component return a string to search
    setSearchValue(value);
  };

  const onBackClick = () => {
    history.goBack();
  };

  const onNextClick = () => {
    const data = selectedOperators;
  
    history.push({
      pathname: usingExistingFlow ? paths.CREATE_KEYS_EXISTING : paths.CREATE_KEYS_CREATE,
      state: { data }
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles the selection of a cluster size option.
   *
   * This function updates the clusterSizeOptions state to set the selected
   * item as active and deactivate the other items.
   *
   * @param {ClusterSizeOption} item - The cluster size option that was selected.
  */
  const handleClusterSize = (item: ClusterSizeOption) => {
    const operatorIds = Object.keys(selectedOperators).map(Number);

    // Exclude the default operator from the sorting and slicing
    const nonDefaultOperatorIds = operatorIds.filter(id => id !== defaultOperator.id);

    // Slice to keep only up to `item.label - 1` operators (since defaultOperator will always be included)
    const newSelectedOperatorIds = nonDefaultOperatorIds.slice(0, item.label - 1);

    // Create new selected operators object including the default operator
    const newSelectedOperators = {
      [defaultOperator.id]: defaultOperator,
      ...newSelectedOperatorIds.reduce((acc, id) => {
        acc[id] = selectedOperators[id];
        return acc;
      }, {} as { [key: number]: any }),
    };
    setSelectedOperators(newSelectedOperators);

    setSelectedClusterSize(item.label);
    // Update active status for each item
    setClusterSizeOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === item.id ? { ...option, active: true } : { ...option, active: false }
      )
    );
  };

  const handleRemove = (id: number) => {
    const newSelectedOperators = { ...selectedOperators };
    delete newSelectedOperators[id];
    setSelectedOperators(newSelectedOperators);
  };

  /**
   * Handles the selection of operators by ensuring the selection is unique and includes the default operator.
   *
   * @param {any[]} selectionData - An array of selected operator objects.
  */
  const handleOperatorSelection = (selectionData: any[]) => {
    // Use a Set to get unique operator IDs from the selection data
    const uniqueSelectionData = Array.from(new Set(selectionData.map(op => op.id)))
      // Map back the unique IDs to their respective operator objects
      .map(id => selectionData.find(op => op.id === id));

    // Create a new object to hold the selected operators, including the default operator
    let newSelectedOperators = {} as any;

    // Always include the default operator
    newSelectedOperators[defaultOperator.id] = defaultOperator;

    // Add the unique selected operators to the newSelectedOperators object
    uniqueSelectionData.forEach((operator: any) => {
      newSelectedOperators[operator.id] = operator;
    });

    // Update the state with the new set of selected operators
    setSelectedOperators(newSelectedOperators);
  };

  /**
   * Handles the selection of filter options by updating the filter value state.
   * If the selected option is not already in the filter value array, it adds the option.
   * If the selected option is already in the filter value array, it removes the option.
   *
   * @param {string} option - The filter option that was selected or deselected.
  */
  const handleFilterSelected = (option: string) => {
    const selectedIndex = filterValue.indexOf(option);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...filterValue, option];
    } else {
      newSelected = filterValue.filter((item: any) => item !== option);
    }
    
    setFilterValue(newSelected);
    setAnchorEl(null);
  };

  return (
   <WizardWrapper
    actionBarItems={[
      <Button variant="text" color="info" onClick={() => onBackClick()} tabIndex={3} startIcon={<KeyboardArrowLeft />}>Back</Button>,
      // loading, operator not selected or selected operators less than selected cluster size disable next button
      <Button variant="contained" color="primary" disabled={sortedSelectedOperators.length < selectedClusterSize || isMaximumValidator } onClick={() => onNextClick()} tabIndex={2}>Next</Button>,
    ]}
    activeTimelineIndex={2}
    timelineItems={usingExistingFlow ? ExistingMnemonicFlow : CreateMnemonicFlow}
    title="Choose your operator">
      <div className="tw-max-w-[1580px] tw-mx-auto tw-grid tw-grid-cols-2 xl:tw-grid-cols-4 tw-rounded-xl tw-shadow-xl tw-mx-4 tw-bg-[#FAFAFA] tw-pb-4 tw-px-4">
        {/* left section - cluster size & operator table */}
        <div className="tw-col-span-3 tw-px-4 tw-py-2">
          <div className="tw-flex tw-items-center">
            <h2 className="tw-font-normal tw-mr-8 tw-text-primary">Pick the cluster of network operators to run your validator</h2>
            <OperatorSearch onSearch={handleSearch} />
          </div>
          <div className="tw-flex tw-items-center tw-mb-8 tw-flex-wrap">
            <div className="tw-text-lg tw-mr-4 tw-min-w-24 tw-mt-4 tw-text-grayText">Cluster Size</div>
            {/* cluster size option */}
            {clusterSizeOptions.map((item: ClusterSizeOption, index: number) => (
              <div onClick={() => handleClusterSize(item)} className={`tw-mt-4 tw-cursor-pointer tw-border tw-mr-4 tw-min-w-[160px] tw-h-10 tw-leading-10 tw-text-center tw-rounded-md tw-bg-white ${item.active ? 'tw-border-solid tw-border-gray5' : ''}`} key={index}>
                {item.label}
              </div>
            ))}
            {/* Filter */}
            <Button onClick={handleClick} className="tw-mt-4 tw-h-10 tw-flex tw-items-center">
              <FilterAltOutlined />
              { filterValue.length > 0 ? <div className="tw-h-5 tw-w-5 tw-flex tw-justify-center tw-items-center tw-ml-2 tw-rounded-full tw-bg-lightBlue">{filterValue.length}</div> : '' }
            </Button>
            <Menu
              id="multi-select-menu"
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose} 
              MenuListProps={{
                'aria-labelledby': 'multi-select-button',
                sx: {
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              {FILTER_OPTION.map((option, index) => (
                <MenuItem key={index} onClick={() => handleFilterSelected(option)}>
                  <Checkbox checked={filterValue.includes(option)} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Menu>
          </div>
          
          <OperatorTable onOperatorSelection={handleOperatorSelection} selectedClusterSize={selectedClusterSize} selectedOperators={selectedOperators} searchValue={searchValue} filterValue={filterValue} />
        </div>
        
        {/* right section - selected operators & warning */}
        <div className="tw-col-span-3 xl:tw-col-span-1 tw-px-4 tw-py-2">
          <div className="tw-hidden xl:tw-block" style={{ height: '4.5rem' }}></div>

          <div className="tw-flex tw-justify-between tw-items-center tw-mr-4">
            <h2 className="tw-font-normal tw-text-primary tw-text-lg">Selected Operators</h2>
            <h2 className="tw-text-primary tw-text-lg">{Object.keys(selectedOperators).length} / {selectedClusterSize}</h2>
          </div>
            
          <div className="xl:tw-h-[555px] tw-overflow-y-auto tw-grid tw-grid-cols-2 xl:tw-grid-cols-1 tw-mb-4">
            {Array(selectedClusterSize).fill(null).map((_, i) => {
              const operator = sortedSelectedOperators[i];
              return operator ? (
                <div className="tw-col-span-1" key={i}>
                  <div className="tw-border tw-border-gray tw-grid tw-grid-cols-12 tw-h-28 tw-mt-4 rounded-xl tw-relative clusterClass tw-mr-4">
                    <Avatar
                      className="tw-col-span-2"
                      alt="logo"
                      src={operator.logo}
                      sx={{ width: 36, height: 36 }}
                    />
                    <div className="tw-col-span-9">
                      <div className="tw-text-lg tw-font-semibold tw-text-primary">{operator.name}</div>
                      <div className="tw-text-gray tw-font-semibold">ID: {operator.id}</div>
                      <div className="tw-mt-4 tw-font-bold tw-text-primary">{(Number(operator.fee) / SSV_EXCHANGE).toFixed(2)} SSV</div>
                    </div>
                    <div className="tw-col-span-1 tw-flex-col tw-flex tw-justify-between tw-items-center">
                      <div>
                        <MevRelayerTooltipComponent mevRelays={operator.mev_relays} />
                      </div>
                      {operator.id == defaultOperator.id && (
                        <div className="tw-w-4 tw-items-end tw-mr-1 tw-pb-1"><Lock color="secondary" /></div>
                      )}
                    </div>
                    {operator.id !== defaultOperator.id && (
                      <IconButton
                        className="tw-absolute tw-top-[-12px] tw-right-[-12px] tw-bg-gray tw-w-6 tw-h-6 hover:tw-bg-gray"
                        onClick={() => handleRemove(operator.id)}
                      >
                        <Remove fontSize="small" style={{ color: '#ffffff' }} />
                      </IconButton>
                    )}
                  </div>
                </div>
              ) : (
                <div key={i} className="tw-col-span-1 tw-rounded-xl tw-bg-white tw-text-grayText tw-font-semibold tw-border-2 tw-border-dashed tw-border-gray tw-p-4 tw-flex tw-items-center tw-mr-4 tw-justify-center tw-h-28 tw-mt-4">
                  Select operator { i + 1 }
                </div>
              );
            })}
          </div>

          <Divider />
          
          <div className="tw-flex tw-justify-between tw-items-center tw-text-base tw-mr-4 tw-mt-6">
            <div className="tw-font-medium tw-flex tw-items-center">
              <div className="tw-mr-2">Operators Yearly Fee</div>
              <YearlyFeeTooltip
                title={
                  <div className="tw-px-4">
                    {/* not verified warning */}
                    {isUnVerifiedSelected && (
                      <div className="tw-my-4 tw-text-sm">
                        <div className="tw-font-bold">• You have selected one or more operators that are not verified.</div>
                        <div className="tw-font-normal">Unverified operators that were not reviewed and their identity is not confirmed, may pose a threat to your validators' performance.</div>
                        <div className="tw-font-normal">Please proceed only if you know and trust these operators.</div>
                      </div>
                    )}
                  </div>
                }>
                <ErrorOutline style={{ color: "#ffd20a", cursor: 'pointer' }} />
              </YearlyFeeTooltip>
            </div>

            <div className="tw-font-bold">{totalFee.toFixed(2)} SSV</div>
          </div>

          {/* exceeded validator warning */}
          {isMaximumValidator && (
            <div className="error-card tw-mt-4 tw-mr-4">
              One of your chosen operators has reached its maximum validator capacity. Please select an alternative operator.
            </div>)}
        </div>
      </div>
    </WizardWrapper>
  );
};

export default ChooseOperators;