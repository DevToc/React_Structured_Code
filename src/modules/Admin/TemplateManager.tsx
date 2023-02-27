import { ReactElement, useEffect, useState } from 'react';
import { Routes } from 'constants/routes';
import { Button, Box, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Link, Table } from '@chakra-ui/react';
import { backend, getAllTemplates, TemlpateEntry, newFromTemplate } from '../../libs/e2api/query';

interface TemplateEntry {
  infographId: string;
  templateId: string;
  createdAt: string;
  modifiedAt: string;
}

interface SectionComponentProp {
  jwtToken: string;
}

export const TemplateManager = ({ jwtToken }: SectionComponentProp): ReactElement => {
  const [templates, setTemplates] = useState<Array<TemplateEntry>>([]);

  const fetchTemplates = (jwtToken: string) => {
    backend.setAuthToken(jwtToken);

    if (jwtToken) {
      getAllTemplates().then((l: TemlpateEntry[]) => setTemplates(l));
    }
  };

  const createInfograph = (templateId: string) => {
    newFromTemplate(templateId).then(({ infographId }) => {
      alert(`New infograph ID: ${infographId}`);
    });
  };

  useEffect(() => {
    fetchTemplates(jwtToken);
  }, [jwtToken]);

  return (
    <Box>
      <Button size={'xs'} onClick={() => fetchTemplates(jwtToken)}>
        Refresh
      </Button>
      <TableContainer>
        <Table variant='simple'>
          <TableCaption>List of all templates</TableCaption>
          <Thead>
            <Tr>
              <Th>Template ID</Th>
              <Th>Source Infograph ID</Th>
              <Th>Created at</Th>
              <Th>Modified at</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {templates?.map((t, i) => {
              return (
                <Tr key={i}>
                  <Td>{t.templateId}</Td>
                  <Td>
                    <Link
                      color={'blue'}
                      rel='noreferrer'
                      href={`${Routes.DESIGN}/${t.infographId || '-'}`}
                      target={'_blank'}
                    >
                      {t.infographId || '-'}
                    </Link>
                  </Td>
                  <Td>{t.createdAt}</Td>
                  <Td>{t.modifiedAt}</Td>
                  <Td>
                    <Button mr={2} size={'xs'} onClick={() => createInfograph(t.templateId)}>
                      Create infograph
                    </Button>
                    <Button size={'xs'}>Tags</Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
