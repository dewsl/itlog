import React, { Fragment, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { DataTable } from 'react-native-paper';

const EquipmentManager = () => {
    const optionsPerPage = [2, 3, 4];
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  
    useEffect(() => {
      setPage(0);
    }, [itemsPerPage]);

    return(
        <Fragment>
            <DataTable>
            <DataTable.Header>
                <DataTable.Title>Inventory ID</DataTable.Title>
                <DataTable.Title numeric>Equipment ID</DataTable.Title>
                <DataTable.Title numeric>DataLogger Name</DataTable.Title>
                <DataTable.Title numeric></DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
                <DataTable.Cell>1</DataTable.Cell>
                <DataTable.Cell>1</DataTable.Cell>
                <DataTable.Cell>AGBSB</DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
            </DataTable.Row>

            <DataTable.Pagination
                page={page}
                numberOfPages={3}
                onPageChange={(page) => setPage(page)}
                label="1-2 of 6"
                optionsPerPage={optionsPerPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                showFastPagination
                optionsLabel={'Rows per page'}
            />
            </DataTable>
        </Fragment>
    )
}

export default EquipmentManager;