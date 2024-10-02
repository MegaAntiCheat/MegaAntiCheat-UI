const critRemaps: Record<string, string> = {
  tf_projectile_arrow: 'huntsman_headshot',
  sniperrifle: 'headshot',
  bazaar_bargain: 'headshot',
  player_penetration: 'player_penetration_headshot',
  pro_rifle: 'headshot',
  the_classic: 'headshot',
  shooting_star: 'headshot',
  awper_hand: 'headshot',
  ambassador: 'headshot',
  knife: 'backstab',
  eternal_reward: 'backstab',
  kunai: 'backstab',
  big_earner: 'backstab',
  voodoo_pin: 'backstab',
  sharp_dresser: 'backstab',
  spy_cicle: 'backstab',
  black_rose: 'backstab',
};

const knownIcons = [
  'airstrike',
  'ai_flamethrower',
  'ambassador',
  'amputator',
  'annihilator',
  'apocofists',
  'armageddon',
  'atomizer',
  'awper_hand',
  'axtinguisher',
  'backburner',
  'backstab',
  'back_scatter',
  'back_scratcher',
  'ball',
  'bat',
  'batsaber',
  'battleaxe',
  'battleneedle',
  'bazaar_bargain',
  'big_earner',
  'blackbox',
  'black_rose',
  'bleed_kill',
  'blutsauger',
  'bonesaw',
  'boston_basher',
  'bottle',
  'brass_beast',
  'bread_bite',
  'bushwacka',
  'candy_cane',
  'claidheamhmor',
  'compound_bow',
  'cow_mangler',
  'crossing_guard',
  'crusaders_crossbow',
  'deflect_arrow',
  'deflect_flare',
  'deflect_promode',
  'deflect_rocket',
  'deflect_sticky',
  'degreaser',
  'demokatana',
  'demoshield',
  'detonator',
  'diamondback',
  'disciplinary_action',
  'dragons_fury',
  'dragons_fury_bonus',
  'dumpster_device',
  'enforcer',
  'eternal_reward',
  'eureka_effect',
  'eviction_notice',
  'family_business',
  'fireaxe',
  'fists',
  'flamethrower',
  'flaregun',
  'force_a_nature',
  'freedom_staff',
  'frontier_justice',
  'fryingpan',
  'gas_blast',
  'gloves',
  'gloves_running_urgently',
  'guillotine',
  'ham_shank',
  'headshot',
  'headtaker',
  'holiday_punch',
  'holy_mackerel',
  'hot_hand',
  'huntsman_flyingburn',
  'huntsman_headshot',
  'iron_bomber',
  'iron_curtain',
  'knife',
  'club',
  'kunai',
  'lava_axe',
  'lava_bat',
  'letranger',
  'liberty_launcher',
  'loch_n_load',
  'lollichop',
  'long_heatmaker',
  'loose_cannon',
  'loose_cannon_impact',
  'machina',
  'mailbox',
  'manmelter',
  'mantreads',
  'market_gardener',
  'maxgun',
  'memory_maker',
  'minigun',
  'natascha',
  'nessieclub',
  'nonnonviolent_protest',
  'obj_minisentry',
  'obj_sentrygun1',
  'obj_sentrygun2',
  'obj_sentrygun3',
  'paintrain',
  'panic_attack',
  'pep_brawlerblaster',
  'pep_pistol',
  'persian_persuader',
  'phlogistinator',
  'pistol',
  'player',
  'player_penetration',
  'player_penetration_headshot',
  'pomson',
  'powerjack',
  'prinny_machete',
  'proto_syringe',
  'pro_rifle',
  'pro_smg',
  'quake_rl',
  'quickiebomb_launcher',
  'rainblower',
  'rescue_ranger',
  'reserve_shooter',
  'revolver',
  'righteous_bison',
  'robot_arm',
  'robot_arm_blender_kill',
  'robot_arm_combo_kill',
  'rocketlauncher_directhit',
  'samrevolver',
  'sandman',
  'saxxy',
  'scattergun',
  'scorch_shot',
  'scotland_shard',
  'scout_sword',
  'shahanshah',
  'sharp_dresser',
  'shooting_star',
  'short_circuit',
  'short_stop',
  'shotgun_primary',
  'shotgun_pyro',
  'shotgun_soldier',
  'shovel',
  'skullbat',
  'sledgehammer',
  'smg',
  'sniperrifle',
  'soda_popper',
  'solemn_vow',
  'southern_hospitality',
  'splendid_screen',
  'spy_cicle',
  'steel_fists',
  'sticky_resistance',
  'suicide',
  'sword',
  'sydney_sleeper',
  'syringegun_medic',
  'taunt_demoman',
  'taunt_guitar_kill',
  'taunt_heavy',
  'taunt_medic',
  'taunt_pyro',
  'taunt_scout',
  'taunt_sniper',
  'taunt_soldier',
  'taunt_spy',
  'telefrag',
  'tf_projectile_arrow',
  'tf_projectile_mechanicalarmorb',
  'tf_projectile_pipe',
  'tf_projectile_pipe_remote',
  'tf_projectile_rocket',
  'tf_pumpkin_bomb',
  'the_capper',
  'the_classic',
  'the_maul',
  'the_winger',
  'thirddegree',
  'tide_turner',
  'tomislav',
  'tribal_kukri',
  'ubersaw',
  'ullapool_caber',
  'ullapool_caber_explosion',
  'unarmed_combat',
  'unique_pickaxe',
  'unique_pickaxe_escape',
  'voodoo_pin',
  'warfan',
  'warrior_spirit',
  'widowmaker',
  'world',
  'wrangler_kill',
  'wrap_assassin',
  'wrench',
  'wrench_golden',
  'wrench_jag',
];
const backupIcon = 'suicide';

export function getWeaponImage(weapon: string, crit: boolean) {
  if (crit && critRemaps[weapon]) weapon = critRemaps[weapon];

  if (!knownIcons.includes(weapon))
    return `./killfeed/Killicon_${backupIcon}.png`;
  return `./killfeed/Killicon_${weapon}.png`;
}