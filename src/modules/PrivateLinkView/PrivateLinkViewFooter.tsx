import { Flex, Text, Link } from '@chakra-ui/react';
import { ReactComponent as FlagIcon } from '../../assets/icons/flag.svg';
import { PHP_PROXY_API_DOMAIN } from '../../constants/infograph';
import { PRIVATELINK_REPORT_LINK, PRIVATELINK_DMCA_POLICY_LINK } from '../../constants/links';

const PrivateLinkViewFooter = () => {
  const { firstName, lastName } =
    !!PHP_PROXY_API_DOMAIN && VenngageE2.designOwner
      ? VenngageE2.designOwner
      : { firstName: 'Venngage', lastName: 'Inc.' };
  return (
    <Flex
      w={816}
      maxW={'90vw'}
      flexDir='column'
      color='white'
      justifyContent='center'
      alignItems='center'
      mt={9}
      pb={20}
    >
      <Flex
        h={'60px'}
        w='100%'
        px={[3, 30]}
        flexDir='row'
        justifyContent='space-between'
        alignItems='center'
        bgColor={'var(--vg-colors-privateLinkView-footerBg)'}
        borderRadius={'10px'}
      >
        <Text fontWeight='semibold' data-testid='pl-designOwner-info'>
          {`Created by ${firstName} ${lastName.charAt(0)}`}
        </Text>
        <Link
          fontWeight='medium'
          display='flex'
          flexDir='row'
          gap={2}
          justifyContent='center'
          alignItems='center'
          href={PRIVATELINK_REPORT_LINK}
          isExternal
          data-testid='pl-report-link'
        >
          <FlagIcon />
          Report
        </Link>
      </Flex>
      <Text fontSize={'sm'} fontWeight='normal' lineHeight='base' mt={5} mb={2.5}>
        {`Copyright ${new Date().getFullYear()} Venngage Inc`}
      </Text>
      <Link
        fontSize={'sm'}
        fontWeight='normal'
        lineHeight='base'
        textDecor={'underline'}
        href={PRIVATELINK_DMCA_POLICY_LINK}
        isExternal
      >
        DMCA Policy
      </Link>
    </Flex>
  );
};

export default PrivateLinkViewFooter;
