import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import { ReactComponent as VenngageLogoIcon } from 'assets/icons/venngage_logo.svg';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { TemplateManager } from './TemplateManager';
import { InfographManager } from './InfographManager';
import { GeneratorPage } from './Generator';

interface AdminLoginProps {
  setJwtToken: (s: string) => void;
}

const AdminLogin = ({ setJwtToken }: AdminLoginProps): ReactElement => {
  const [tokenInput, setTokenInput] = useState<string>('');

  // TODO: Check the token before setting

  return (
    <Container mt={8}>
      <Alert status={'warning'}>
        <AlertIcon />
        Please enter JWT token to use admin services.
      </Alert>
      <FormControl mt={4}>
        <FormLabel>JWT Token</FormLabel>
        <Input value={tokenInput} type='text' onChange={(e) => setTokenInput(e.target.value)} />
        <FormHelperText>
          You are logging in as the JWT token user. Get this token from .. (explain where) This token will be saved in
          local storage.
        </FormHelperText>
      </FormControl>
      <Button mt={4} onClick={() => setJwtToken(tokenInput)}>
        Login
      </Button>
    </Container>
  );
};

const AdminDashboard = (): ReactElement => {
  return <Text>admin dashboard</Text>;
};

const AdminPage = (): ReactElement => {
  const [jwtToken, setJwtToken] = useLocalStorage<string>('jwtToken', '');
  const [section, setSection] = useState<'template_manager' | 'infograph_manager' | 'dashboard' | 'generator'>(
    'dashboard',
  );

  let SectionComponent;

  switch (section) {
    case 'dashboard':
      SectionComponent = <AdminDashboard />;
      break;
    case 'template_manager':
      SectionComponent = <TemplateManager jwtToken={jwtToken} />;
      break;
    case 'infograph_manager':
      SectionComponent = <InfographManager jwtToken={jwtToken} />;
      break;
    case 'generator':
      SectionComponent = <GeneratorPage jwtToken={jwtToken} />;
      break;
    default:
      SectionComponent = <Text>Invalid section</Text>;
  }

  return (
    <Box>
      <Flex p={2} justifyContent={'space-between'}>
        <Flex>
          <VenngageLogoIcon stroke='brand.500' />
          <Heading size={'lg'}>Admin</Heading>
        </Flex>
        {jwtToken !== '' ? (
          <Flex>
            <Button size={'sm'} onClick={() => setJwtToken('')}>
              Logout
            </Button>
          </Flex>
        ) : null}
      </Flex>
      {jwtToken !== '' ? (
        <Flex p={2}>
          <VStack w={'xs'} alignItems={'flex-start'}>
            <Button size={'sm'} onClick={() => setSection('dashboard')}>
              Dashboard
            </Button>
            <Button size={'sm'} onClick={() => setSection('template_manager')}>
              Templates
            </Button>
            <Button size={'sm'} onClick={() => setSection('infograph_manager')}>
              Infographs
            </Button>
            <Button size={'sm'} onClick={() => setSection('generator')}>
              Generator
            </Button>
          </VStack>
          {SectionComponent}
        </Flex>
      ) : (
        <AdminLogin setJwtToken={setJwtToken} />
      )}
    </Box>
  );
};

export default AdminPage;
