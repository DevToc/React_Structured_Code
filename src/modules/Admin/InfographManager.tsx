import {
  Box,
  Button,
  Heading,
  Link,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import cloneDeep from 'lodash.clonedeep';
import { newInfographId, newPageId } from 'utils/idFactory';
import { useNavigate } from 'react-router-dom';
import { initialState as initialInfographState } from 'modules/Editor/store/infographSlice';
import { backend, duplicateInfograph, saveFullInfograph, newTemplate as createNewTemplate } from 'libs/e2api/commit';
import { getAllInfographs, QueryResult } from 'libs/e2api/query';
import { useEffect, useState } from 'react';
import { Routes } from 'constants/routes';
import { Page } from 'types/pageTypes';

interface SectionComponentProp {
  jwtToken: string;
}

function Index() {
  const navigate = useNavigate();

  const [infographListing, setInfographListing] = useState<QueryResult[]>([]);

  useEffect(() => {
    getAllInfographs().then((l) => setInfographListing(l));
  }, []);

  const makeNewInfograph = () => {
    const blankInfograph = cloneDeep(initialInfographState);
    blankInfograph['id'] = newInfographId();
    // Add blank page
    const newPage: Page = {
      widgetLayerOrder: [],
      widgetStructureTree: ['div', {}, []],
      background: '#fff',
    };
    const newId = newPageId();

    blankInfograph.pages[newId] = newPage;
    blankInfograph.pageOrder.push(newId);

    saveFullInfograph(blankInfograph).then((r) => {
      navigate(`${Routes.DESIGN}/${blankInfograph['id']}`);
    });
  };

  const copyInfograph = (sourceId: string) => {
    duplicateInfograph(sourceId).then((r) => {
      if (!r || !r['id']) {
        console.debug('failed to duplicate');
      } else {
        navigate(`${Routes.DESIGN}/${r['id']}`);
      }
    });
  };

  const newTemplate = (sourceId: string) => {
    createNewTemplate(sourceId).then((r) => {
      if (!r || !r.templateId) {
        alert('failed to create template');
      } else {
        alert('New template created');
      }
    });
  };

  return (
    <Box>
      <Heading mt={4}>Temporary Index Page</Heading>
      <Button onClick={makeNewInfograph}>Create new infograph</Button>
      <TableContainer>
        <Table variant='simple'>
          <TableCaption>List of all infographs</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Created at</Th>
              <Th>Modified at</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {infographListing &&
              infographListing.map((infographInfo, i) => (
                <Tr key={i}>
                  <Td>
                    <Link
                      color={'blue'}
                      rel='noreferrer'
                      href={`${Routes.DESIGN}/${infographInfo['id']}`}
                      target={'_blank'}
                    >
                      {infographInfo['id'] || '-'}
                    </Link>
                  </Td>
                  <Td>{infographInfo['title'] || '-'}</Td>
                  <Td>{infographInfo['created_at']?.toString() || '-'}</Td>
                  <Td>{infographInfo['modified_at']?.toString() || '-'}</Td>
                  <Td>
                    <Button size={'xs'} onClick={() => copyInfograph(infographInfo['id'])}>
                      Copy
                    </Button>
                    <Button size={'xs'} onClick={() => newTemplate(infographInfo['id'])}>
                      New template
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

/**
 * List infographs for a logged in user
 *
 * @constructor
 */
export function InfographManager({ jwtToken }: SectionComponentProp) {
  backend.setAuthToken(jwtToken);
  return <Index />;
}
