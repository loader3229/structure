'use strict'

const SKILLS = {
	autoTarget: {
		name: "自动搜索",
		desc: "完成目标后自动选择新目标",
		map : 1,
		mult : 5,
		exp : 500
	},
	sensor: {
		name: "翻山越岭",
		desc: "增强探测周围目标的能力",
		map : 1,
		mult : 1.2,
		exp : 500
	},
	charge: {
		name: "装填",
		desc: "停止的时候能增强士气",
		map : 2,
		mult : 2,
		exp : 1000
	},
	autoTargetFilter: {
		name: "目的地无处可去",
		desc: "允许设定自动搜索的基础优先级",
		req : ["autoTarget"],
		map : 3,
		mult : 1.5,
		exp : 2500
	},
	invest: {
		name: "没有牺牲就没有胜利",
		desc: "允许把成长转化为经验",
		map : 3,
		mult : 10,
		exp : 7500
	},
	mining: {
		name: "又深又黑",
		desc: "允许在起点采集黄金",
		map : 4,
		mult: 2,
		exp : 2500
	},
	autoTargetSelector: {
		name: "灵魂的旅途",
		desc: "允许设定自动搜索的高级优先级",
		map : 5,
		req : ['autoTargetFilter'],
		mult: 1.5,
		exp : 10000
	},
	learn: {
		name: "指引我如何活着",
		desc: "允许消耗等同于成长加成的经验值使成长变为三倍",
		sliders : 2,
		req : ['invest'],
		mult: 3,
		exp : 55555.55556
	},
	upgradePoints: {
		name: "魔域交响曲",
		desc: "允许升级占领点数",
		map : 7,
		mult: 2,
		exp : 92592.592593
	},
	fire: {
		name: "穿越火焰",
		desc: "火焰伤害不再受到精神惩罚",
		map : 8,
		mult: 3,
		exp : 200000
	},
	build1: {
		name: "超大城市",
		desc: "允许在1级节点上建筑", //原文 Ability to build at level 1 points
		map : 9,
		req : ['upgradePoints'],
		mult: 2,
		exp : 3086419.75308644
	},
	autoTargetElements: {
		name: "元素, pt.1",
		desc: "允许在自动搜索中设定元素优先级",
		map : 11,
		req : ['autoTargetFilter'],
		mult: 1.5,
		exp : 15432098.7654323
	},
	channel: {
		name: "战歌",
		desc: "允许将属性直接传递到其它滑块，代替成长",
		mult: 2,
		exp : 257201646.09053498,
		sliders : 3
	},
	management: {
		name: "创建王国",
		desc: "允许在一个地方一次性管理所有点",
		req : ['upgradePoints'],
		res : ['science'],
		map : 9,
		mult: 1.2,
		exp : 128600823.0452675,
		science : 100000
	},
	ice : {
		name: "冰之大地",
		desc: "冰冻伤害不再受到精神惩罚",
		map : 12,
		mult: 2.5, 
		exp : 1286008230.452675
	},
	build2 : {
		name: "超大城市 2.0",
		desc: "解锁 2 级建筑",
		map : 12,
		mult: 5, 
		exp : 1286008230.452675,
		req : ['upgradePoints'],
	},
	greed : {
		name: "黄金强化",
		desc: "黄金工厂生产更多黄金",
		map : 13,
		mult: 1.3, 
		exp : 1286008230.452675,
		req : ['build1'],
		onGet: () => game.production.gold *= game.realMap.level ** 2 / 16.9,
	},
	fear : {
		name : "恐怖统治",
		desc : "滑块的力量额外获得恐惧*精神的加成",
		map : 14,
		mult : 2.4,
		exp : 98923710034.82115 / 3,
		req : ['build2'],
		res : ['fears'],
	},
	automation: {
		name : "宏伟的设计",
		desc : "解锁自动点数提升",
		map : 9,
		mult : 3,
		exp : 12860082304.52675,
		req : ["management"],
		res : ['science'],
		science : 1e6
	},
	stardust: {
		name: "掌控天空",
		desc: "星云中每个云会加成100%元素产出",
		map : 15,
		mult : 5,
		req : ['build2'],
		res : ['clouds', 'stardust'],
		exp : 98923710034.82115 / 3,
	},
	magic: {
		name: "强大的魔法英雄",
		desc: "解锁整个魔法世界",
		map : 16,
		mult : 2,
		sliders : 4,
		exp : 98923710034.82115,
	},
	magicBoost1: {
		name: "神奇王国",
		desc: "魔圈内1级建筑产出提升",
		map : 16,
		mult : 3,
		req : ["magic"],
		exp : 2e10,
	},
	smartHome: {
		name: "到家了",
		desc: "滑块无法找到目标时自动回到初始点挖矿",
		req : ["autoTarget"],
		res : ['science'],
		map : 9,
		mult : 1.1,
		exp : 2e10,
		science : 1.75e6,
	},
	smartMine: {
		name: "回首往事",
		desc: "正在挖掘和攻击的滑块可以随时寻找更好的目标",
		req : ["smartHome"],
		res : ['science'],
		map : 9,
		mult : 1.0,
		exp : 2e10,
		science : 2e6,
	},
	buildAutomation: {
		name : "最终建好了",
		desc : "解锁自动建筑",
		map : 9,
		mult : 3,
		exp : 2e10,
		req : ["management"],
		res : ['science'],
		science : 2.5e6
	},
	smartAuto: {
		name: "静静地走开",
		desc: "滑块会在无法造成伤害时自动撤离，并避开这些强大的目标",
		req : ["autoTarget", "mining"],
		res : ['science'],
		map : 9,
		mult : 1.1,
		exp : 2e10,
		science : 1e7,
	},
	autoTargetDistance: {
		name: "远离世界末日",
		desc: "允许设定自动搜索的距离优先级",
		req : ["smartAuto","autoTargetSelector"],
		res : ['science'],
		map : 9,
		mult : 1.5,
		exp : 2e10,
		science : 1e10,
	},
	imbuement: {
		name: "元素, pt.2",
		desc: "消耗法力把力量转换成元素伤害",
		req : ["magic"],
		map : 17,
		mult: 4,
		exp : 4e12
	},
	blood: {
		name: "鲜血光环",
		desc: "血液伤害不再受到精神惩罚",
		map : 17,
		mult : 2,
		exp : 2e11,
	},
	metal: {
		name: "大量金属",
		desc: "金属伤害不再受到精神惩罚",
		map : 17,
		mult : 2,
		exp : 2e11,
	},
	magicGrowthBoost: {
		name: "魔法森林",
		desc: "魔圈内元素成长获得加成",
		map : 18,
		mult : 3,
		req : ["magic"],
		exp : 4e12,
	},
	gild: {
		name: "金色黎明",
		desc: "滑块在战斗时可以消耗法力并获得黄金",
		map : 18,
		mult : 1.5,
		req : ["magic"],
		exp : 2e12,
	},
	build3: {
		name: "未来大陆",
		desc: "解锁 3 级建筑",
		req : ["build2"],
		map : 19,
		mult: 2,
		exp : 1e13
	},
	power: {
		name: "绝对力量",
		desc: "物理伤害不再受到精神惩罚", // 原文 Physical attack ignores spirit penalty
		map : 21,
		mult: 2,
		exp : 1e17
	},
	spellcasting : {
		name: "魔法宝典的秘密",
		desc: "允许学习和使用法术",
		sliders : 5,
		mult : 2,
		exp : 1e18
	},
	book_summons1 : {
		name: "战士的法术",
		desc: "法术书 - 召唤克隆并攻击目标",
		req : ["spellcasting"],
		science : 10e12,
		exp : 1e19,
		mult : 1,
	},
	virtualMaps: {
		name : "虚拟帝国",
		desc : "使用星云来创建和探索虚拟地图",
		map : 22,
		mult : 2,
		exp : 2e20
	},
	book_dispels1 : {
		name: "打破规则",
		desc: "法术书 - 破坏被保护的节点的免疫效果",
		req : ["spellcasting"],
		map : 23,
		science : 30e12,
		exp : 1e19,
		mult : 1,
	},
	build4: {
		name : "暴走的机器",
		desc : "建造4级建筑",
		map : 24,
		mult : 3,
		exp : 1e22
	},
	book_enchantments1: {
		name : "魔域交响曲 II",
		desc : "法术书 - 使用法力对占领的节点产生影响",
		map : 25,
		req : ["spellcasting"],
		science : 1e14,
		exp : 2e21,
		mult : 1		
	},
	masterSlider : {
		name : "战争艺术",
		desc : "增加可以同时控制所有滑块的工具",
		req : ["channel", "imbuement", "gild"],
		sliders : 4,
		science : 2e14,
		exp : 1e18,
		mult : 1.05
	},
	magicManagement : {
		name : "Wishmaster",
		desc : "增加一个管理元素的界面",
		req : ["book_enchantments1", "management"],
		science : 4e14,
		exp : 1e22,
		mult : 1.5
	},
	massEnchant : {
		name : "最后一件事",
		desc : "在元素管理界面增加大量魔法",
		req : ["magicManagement"],
		science : 6.5e14,
		exp : 1e22,
		mult : 1.5
	},
	smartSummons : {
		name : "为了孤独行走的人",
		desc : "召唤物更加智能地寻找下一个目标",
		req : ["book_summons1"],
		science : 3e14,
		map : 27,
		exp : 1e22,
		mult : 1.1
	},
	controlSummons : {
		name : "转向",
		desc : "升级召唤物的自动搜索",
		req : ["smartSummons", "masterSlider"],
		science : 5e17,
		map : 36,
		exp : 1e22,
		mult : 1.1
	},
	artifacts: {
		name : "隐藏的宝藏",
		desc : "在挖矿的时候提升工艺品研究",
		sliders : 6,
		mult : 2,
		exp : 5e22
	},
	virtualMapFocus: {
		name : "天堂搜索者",
		desc : "创建针对特定属性的虚拟地图",
		map : 26,
		mult : 2,
		exp : 5e22
	},
	retainVirtualBonus: {
		name : "超越现实",
		desc : "删除虚拟地图时保留它们的奖励",
		map : 27,
		mult : 2,
		exp : 2e22
	},
	book_summons2 : {
		name: "木偶大师",
		desc: "法术书 - 召唤特定元素攻击目标",
		req : ["spellcasting"],
		map : 27,
		science : 2e14,
		exp : 1e19,
		mult : 1,
	},
	book_enchantments2: {
		name : "进入魔法室",
		desc : "法术书 - 根据节点成长获得更多元素",
		map : 28,
		req : ["book_enchantments1","spellcasting"],
		science : 5e14,
		exp : 2e20,
		mult : 1.5
	},
	book_realign1 : {
		name: "欢迎来到另一边",
		desc: "法术书 - 召唤转换",
		req : ["spellcasting", "book_summons2"],
		map : 28,
		science : 3e14,
		exp : 3e20,
		mult : 1.1,
	},
	book_dispels2 : {
		name: "打破沉默",
		desc: "法术书 - 打破召唤禁止的防御",
		req : ["spellcasting"],
		map : 28,
		science : 6e14,
		exp : 2e19,
		mult : 1.5,
	},
	book_unlocks1 : {
		name: "七把钥匙的保管者",
		desc: "法术书 - 解锁所有点数选择",
		req : ["spellcasting"],
		map : 28,
		science : 1e15,
		exp : 2e19,
		mult : 1.5,
	},
	spiritStar : {
		name : "占星师",
		desc : "滑块成长受星尘和星星影响",
		map : 28,
		exp : 2e28,
		mult : 2
	},
	sliderLevels : {
		name : "进化 4.0",
		desc : "允许使用经验升级滑块",
		map : 29,
		exp : 1e30,
		mult : 5.203
	},
	smartTablet : {
		name : "永久刻印",
		desc : "使工艺品研究输入更加智能",
		req : ["artifacts"],
		map : 29,
		exp : 1e28,
		science : 5e14,
		mult : 2
	},
	party : {
		name : "融为一体",
		desc : "允许分配滑块分别称为领导者和跟随者，组成团队",
		map : 30,
		exp : 1e30,
		mult : 2
	},
	imprint : {
		name : "未来记忆",
		desc : "在内存中记录节点信息",
		req : ["build4"],
		sliders : 7,
		science : 7.5e14,
		exp : 1e30,
		mult : 2
	},
	virtualImprint : {
		name : "梦的记忆",
		desc : "记录最近的虚拟地图的星云节点",
		req : ["imprint"],
		science : 8.5e14,
		map : 33,
		exp : 1e30,
		mult : 2
	},
	world : {
		name : "美好的新世界",
		desc : "根据你的记忆创造一个新世界",
		req : ["imprint"],
		map : 31,
		res : ["_1","_2","_3","_4","_5","_6"],
		exp : 1e30,
		mult : 2
	},
	evolveVirtual : {
		name : "在边界外着陆",
		desc : "31级以上的虚拟地图会进化",
		req : ["virtualMaps"],
		map : 32,
		exp : 1e30,
		mult : 2
	},
	levelSummons : {
		name : "力量提升",
		desc : "召唤物占领一个目标后会获得等级并提升能力",
		req : ["smartSummons"],
		map : 34,
		exp : 1e30,
		mult : 2
	},
	starfall : {
		name : "流星雨",
		desc : "完成和当前地图等级相同的虚拟地图会获得基于进化次数的星尘",
		req : ["evolveVirtual"],
		map : 36,
		exp : 1e40,
		mult : 2
	},
	worldCore : {
		name : "心中的王国",
		desc : "过滤记忆来生成更有效率的世界",
		req : ["world"],
		sliders : 8,
		exp : 1e40,
		mult : 2
	},
	autoStar : {
		name : "天文学",
		desc : "自动重新分配星尘",
		req : ["starfall"],
		map : 37,
		exp : 1e41,
		mult : 2
	},
	book_explosive1 : {
		name: "自杀伴随着我",
		desc: "法术书 - 召唤爆炸",
		req : ["spellcasting"],
		map : 38,
		science : 1e16,
		exp : 1e42,
		mult : 1.1,
	},
	starfire : {
		name : "星火",
		desc : "星星在转生时不会碎裂",
		map : 41,
		exp : 1e45,
		mult : 2
	},

	world_blood1 : {
		name : "闹鬼的战场",
		desc : "蓝图 - 战场",
		req : ["world"],
		feat : "blood1",
		exp : 0,
		mult : 2
	},
	world_science1 : {
		name : "智者的崛起",
		desc : "蓝图 - 图书馆",
		req : ["world"],
		feat : "science1",
		exp : 0,
		mult : 2
	},
	world_fire1 : {
		name : "火焰中锻造",
		desc : "蓝图 - 火山",
		req : ["world"],
		feat : "fire1",
		exp : 0,
		mult : 2
	},
	world_ice1 : {
		name : "冰之世界",
		desc : "蓝图 - 冰川",
		req : ["world"],
		feat : "ice1",
		exp : 0,
		mult : 2
	},
	world_metal1 : {
		name : "金属的终结",
		desc : "蓝图 - 垃圾场",
		req : ["world"],
		feat : "metal1",
		exp : 0,
		mult : 2
	},
	world_mana1 : {
		name : "魔法时代",
		desc : "蓝图 - 魔法池",
		req : ["world"],
		feat : "mana1",
		exp : 0,
		mult : 2
	},
	world_summon1 : {
		name : "野兽秀",
		desc : "蓝图 - 稳定器",
		req : ["world"],
		feat : "noabsolute1",
		exp : 0,
		mult : 2
	},
	world_mean1 : {
		name : "风暴要来了",
		desc : "蓝图 - 闪电站",
		req : ["world"],
		feat : "noreal1",
		exp : 0,
		mult : 2
	},
	world_power1 : {
		name : "极限超载",
		desc : "蓝图 - 能量站",
		req : ["world"],
		feat : "power1_disabled",
		map : 52,
		exp : 0,
		mult : 2
	},
	world_connect1 : {
		name : "上升力场",
		desc : "蓝图 - 平原",
		req : ["world"],
		feat : "same1",
		exp : 0,
		mult : 2
	},
	world_connect2 : {
		name : "Old routes - new waters",
		desc : "蓝图 - 岛屿",
		req : ["world"],
		feat : "same3",
		exp : 0,
		mult : 2
	},
}

Object.keys(SKILLS).map(x => SKILLS[x].id = x)
