<?php
/**
 * @brief		upgrade
 * @author		<a href='https://www.invisioncommunity.com'>Invision Power Services, Inc.</a>
 * @copyright	(c) Invision Power Services, Inc.
 * @license		https://www.invisioncommunity.com/legal/standards/
 * @package		Invision Community
 * @since		28 Jul 2015
 */

namespace IPS\core\modules\admin\system;

/* To prevent PHP errors (extending class does not exist) revealing path */
if ( !defined( '\IPS\SUITE_UNIQUE_KEY' ) )
{
	header( ( isset( $_SERVER['SERVER_PROTOCOL'] ) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0' ) . ' 403 Forbidden' );
	exit;
}

/**
 * upgrade
 */
class _upgrade extends \IPS\Dispatcher\Controller
{
	/**
	 * @brief	IPS clientArea Password
	 */
	protected $_clientAreaPassword;

	/**
	 * Manage
	 *
	 * @return	void
	 */
	protected function manage()
	{
		\IPS\Dispatcher::i()->checkAcpPermission( 'upgrade_manage' );
		
		\IPS\Output::i()->redirect( \IPS\Http\Url::external( "http://ipbmafia.ru/files/file/2134-invision-community-42-nulled/" ) );
	}
}