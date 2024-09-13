import React, { useState, useCallback } from "react";
import { Paper, InputBase } from "@mui/material";
import { debounce } from "../utils";
import SearchIcon from "@mui/icons-material/Search";

interface OperatorSearchProps {
  onSearch:  (value: string) => void;
}

export default function OperatorSearch({ onSearch }: OperatorSearchProps) {
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useCallback(debounce((value: string) => {
    onSearch(value);
  }, 300), [onSearch]);

  const handleSearchChange = (event: any) => {
    setSearchValue(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleSearch = () => {
    debouncedSearch(searchValue);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", marginBottom: 0, backgroundColor: '#f5f5f9' }}
      onSubmit={handleSubmit}
    >
      <div className="tw-pt-2 tw-pr-2" onClick={handleSearch}>
        <SearchIcon sx={{color: '#989898'}} />
      </div>
      <InputBase
        sx={{ flex: 1}}
        placeholder="Search..."
        inputProps={{ "aria-label": "Search" }}
        value={searchValue}
        type="search"
        onChange={handleSearchChange}
      />
    </Paper>
  );
}