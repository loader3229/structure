'use strict'

const SlidersTab = Template({
	_init() {
		this.dvDisplay = createElement("div", "sliders "+(this.className || ""), this.parent)
		
		this.master = MasterSlider({
			parent : this.dvDisplay
		})
		
		this.levelUp = SliderLevelUp()

		this.dvSliders = createElement("div", "sliders", this.dvDisplay)
		this.dvReal = createElement("div", "sliders-real", this.dvSliders)
		this.dvClones = createElement("div", "sliders-clones", this.dvSliders)
		this.hover = PointInfoDisplay({
			parent : this.dvDisplay,
			className : "point-info hidden",
			align(x, y) {
				if (x == -1) return
				let width = this.dvDisplay.offsetWidth
				let height = this.dvDisplay.offsetHeight
				x = ((x + width + 5< gui.mainViewport.width) ? (x + 5) : (x - 5 - width))
				y = y - height / 2
				x = Math.max(1, Math.min(gui.mainViewport.width - width - 1, x))
				y = Math.max(1, Math.min(gui.mainViewport.height - height - 1, y))
				this.dvDisplay.style.left = x + "px"
				this.dvDisplay.style.top = y+"px"
			},
			
		})
		this.hover.dvDisplay.style.position = "absolute"

		this.presetMenu = PresetMenu({
			prefix : "p_",
			save(name) {
				game.saveSlidersPreset(name)
			},
			load(name) {
				game.loadSlidersPreset(name)
			},
		})
	},
	
	onSet() {
		delete gui.map.sliderInfo
		delete gui.map.slider
		this.dvDisplay.insertBefore(gui.dvHeader, this.dvDisplay.firstChild)
		gui.setHeader(["gold", "exp", "mana"])
		game.sliders.map(slider => {
			//this.dvSliders.appendChild(slider.dvDisplay)
			if (slider.clone)
				this.dvClones.appendChild(slider.dvDisplay)
			else
				this.dvReal.appendChild(slider.dvDisplay)
			slider.displayStats.map(y => {
				y.expSlider.update()
			})
			slider.equipList.update()
		})
		this.update(true)
	},
	
	update(forced) {
		if (forced) {
			game.sliders.map(slider => {
				slider.updateFullVisibility()
			})
			this.master.update()
		}
		game.sliders.map(slider => {
			slider.updateFullInfo()
		})
		Object.values(this.master.imbuements.attributes).map(x => {
			const totalCost = game.sliders.reduce((v,slider) => v+(slider.clone || masterSlider.safeImbuement && slider.real.imbuementCosts[x.name] > game.resources.mana / 10?0:slider.real.imbuementCosts[x.name]), 0)
			x.dvDisplay.title = cnItem(x.name.capitalizeFirst()) + ": " + displayNumber(totalCost) + " 法力/秒"
		})
		this.hover.update()
		if (this.levelUp.slider) {
			this.levelUp.update()
		}
	}
})

const masterSliderHandler = {
	_init() {
		this.dvDisplay = createElement("div", "master", this.parent)
		this.dvRow1 = createElement("div", "master-row", this.dvDisplay)
		this.dvRow2 = createElement("div", "master-row", this.dvDisplay)

		this.dvPresetsButton = createElement("div", "master-apply apply button", this.dvRow1, "预设")
		this.dvPresetsButton.onclick = (event) => {
			gui.sliders.presetMenu.presets = game.sliderPresets,
			gui.sliders.presetMenu.show(event.clientX, event.clientY)
		}

		this.dvGild = createElement("div", "master-pair", this.dvRow1)
		this.cbMasterGild = GuiCheckbox({
			parent : this.dvGild,
			container : masterSlider,
			value : "masterGild",
			onSet : () => {
				gui.sliders.update(true)
			},
			title : "Master gilding touch control"
		})

		this.cbGild = GuiCheckbox({
			parent : this.dvGild,
			container : masterSlider,
			value : "gild",
			onSet() {
				gui.sliders.update(true)
			},
			title : "Gilding touch",
			override : () => !masterSlider.masterGild
		})
		
		this.dvImbuement = createElement("div", "master-pair", this.dvRow1)
		this.cbMasterImbuement = GuiCheckbox({
			parent : this.dvImbuement,
			container : masterSlider,
			value : "masterImbuement",
			onSet : () => {
				gui.sliders.update(true)
				game.nextTarget = true
			},
			title : "Master imbuement control"
		})

		this.imbuements = SingleAttributePicker({
			parent : this.dvImbuement,
			container : masterSlider,
			value : "imbuement",
			title : "",
			hint : "Consumes mana to add current power to chosen element",
			attributeVisible(x, n) {
				if (n && n < 3) return false
				return (!n || game.growth[x])
			},
			onSet : () => {
				gui.sliders.update(true)
				game.nextTarget = true
			},
			override : () => !(masterSlider.masterImbuement),
		})
		
		this.safeImbuementsSwitch = GuiCheckbox({
			parent : this.imbuements.dvDisplay,
			container : masterSlider,
			value: "safeImbuement",
			title: "Safe",
			hint : "Disable imbuement if less than 10 seconds available"
		})
		
		this.dvChannels = createElement("div", "master-pair", this.dvRow1)
		this.cbMasterChannels = GuiCheckbox({
			parent : this.dvChannels,
			container : masterSlider,
			value : "masterChannel",
			onSet : () => {
				game.nextTarget = true
				gui.sliders.update(true)
			},
			title : "Master channel control"
		})

		this.channels = MultiAttributePicker({
			parent : this.dvChannels,
			container : masterSlider,
			value : "channel",
			title : "",
			hint : "Halts chosen attributes' growth to give bonus equal to current value to other sliders",
			attributeVisible(x, n) {
				return (n && game.growth[x])
			},
			override : () => !(masterSlider.masterChannel),
			onSet : () => game.nextTarget = true,
			onUpdate : () => {
				game.sliders.map(x => {
					x.updateSliders()
				})
			},
		})
		
/*		this.dvAutotarget = createElement("div", "master-autotarget", this.dvRow1)
		this.cbMasterAutotarget = GuiCheckbox({
			parent : this.dvAutotarget,
			container : masterSlider,
			value : "masterAutotarget",
			onSet : () => {
				gui.sliders.update(true)
			},
			title : "Master autotarget control"
		})*/
		
		this.dvAutotargetAll = createElement("div", "master-apply apply button", this.dvRow1, "全部自动目标")
		this.dvAutotargetAll.onclick = (event) => {
			game.sliders.map(x => {
				if (x.clone != 2 && (x.role != ROLE_FOLLOWER || !x.target))
					x.dvATApply.click()
			})
		}
		
		this.cbSummonAvoidSame = GuiCheckbox({
			parent : this.dvRow2,
			container : masterSlider,
			value: "summonAvoidSame",
			visible: () => game.skills.controlSummons,
			title: "Elemental summons avoid same element"
		})

		this.cbSummonAvoidNarrow = GuiCheckbox({
			parent : this.dvRow2,
			container : masterSlider,
			value: "summonAvoidNarrow",
			visible: () => game.skills.controlSummons,
			title: "Summons avoid narrow path"
		})

	},
	
	update() {
		this.dvDisplay.classList.toggle("hidden", !game.skills.masterSlider)
		if (game.skills.masterSlider) {
			this.dvGild.classList.toggle("hidden", !game.skills.gild)
			this.dvImbuement.classList.toggle("hidden", !game.skills.imbuement)
			this.dvChannels.classList.toggle("hidden", !game.skills.channel)
//			this.dvAutotarget.classList.toggle("hidden", !game.skills.autoTarget)
			this.dvAutotargetAll.classList.toggle("hidden", !game.skills.autoTarget)

			this.cbSummonAvoidSame.update()
			this.cbSummonAvoidNarrow.update()
			this.cbMasterGild.update()
			this.cbMasterImbuement.update()
			this.cbMasterChannels.update()
//			this.cbMasterAutotarget.update()
			this.cbGild.update()
			this.safeImbuementsSwitch.update()
			this.imbuements.update()
			this.channels.update()
			this.imbuements.updateVisibility()
			this.channels.updateVisibility()
			if (this.levelUp && this.levelUp.slider)
				this.levelUp.update(true)
		}
		if (this.levelUp && this.levelUp.slider)
			this.levelUp.update()
	},
}

const MasterSlider = Template(masterSliderHandler)

const sliderLevelUpHandler = {
	_init() {
		this.dvHolder = createElement("div", "fullscreen-holder hidden", document.body)
		this.dvHolder.onclick = (event) => {
			if (event.target == this.dvHolder) {
				this.reset()
			}
		}	
		
		this.dvDisplay = createElement("div", "dialog", this.dvHolder)
		this.dvTitle = createElement("div", "dialog-title", this.dvDisplay)
		this.dvLevelUp = createElement("div", "sliderlv-line", this.dvDisplay)
		this.dvLevelUpCost = createElement("div", "sliderlv-info", this.dvLevelUp)
		this.dvLevelUpButton = createElement("div", "button line-end", this.dvLevelUp, "升级")
		this.dvLevelUpButton.onclick = (event) => {
			if (this.slider.canLevelUp() && confirm("升级将重置此滑块在所有地图上的状态为零。你想继续吗?"))
				this.slider.levelUp()
		}
		this.dvMultiCost = createElement("div", "sliderlv-info", this.dvDisplay)
		this.dvMultiHead = createElement("div", "sliderlv-line heavy", this.dvDisplay)
		this.dvMultiHintName = createElement("div", "sliderlv-mult-name", this.dvMultiHead, "成长加成")
		this.dvMultiHintMult = createElement("div", "sliderlv-mult", this.dvMultiHead, "积累")
		this.dvMultiHintLevelMult = createElement("div", "sliderlv-mult-double", this.dvMultiHead, "当前等级")
		this.dvMultiHintTotalMult = createElement("div", "sliderlv-mult", this.dvMultiHead, "总计")
		this.dvMultiHintNextLevelMult = createElement("div", "sliderlv-mult", this.dvMultiHead, "下一级")
		this.multi = POINT_TYPES.slice(1).map(x => {
			const display = {
				id : x,
			}
			display.dvDisplay = createElement("div", "sliderlv-line", this.dvDisplay)
			display.dvName = createElement("div", "sliderlv-mult-name", display.dvDisplay, cnItem(x.capitalizeFirst()))
			display.dvMult = createElement("div", "sliderlv-mult", display.dvDisplay)
			display.dvRaiseHolder = createElement("div", "sliderlv-mult-double", display.dvDisplay)
			display.dvLevelMult = createElement("div", "sliderlv-mult", display.dvRaiseHolder)
			display.dvRaise = createElement("div", "button", display.dvRaiseHolder, "提升")
			display.dvTotalMult = createElement("div", "sliderlv-mult", display.dvDisplay)
			display.dvRaise.onclick = (event) => {
				if (this.slider.canLevel(x))
					this.slider.raiseMulti(x)
			}
			display.dvNextLevelMult = createElement("div", "sliderlv-mult", display.dvDisplay)
			
			return display
		})
		this.dvButtons = createElement("div", "buttons", this.dvDisplay)
		this.dvClose = createElement("div", "button available", this.dvButtons, "关闭")
		this.dvClose.onclick = (event) => this.reset()
	},
	
	set(slider) {
		this.slider = slider
		this.dvHolder.classList.toggle("hidden", false)
		this.update(true)
	},
	
	reset() {
		this.dvHolder.classList.toggle("hidden", true)
		delete this.slider
	},
	
	update(forced) {
		if (!this.slider) return
		if (forced) {
			const next = this.slider.getStatTiers()
			this.multi.map(x => {
				x.dvMult.innerText = "x" + displayNumber(this.slider.multi[x.id],1)
				x.dvLevelMult.innerText = "x" + displayNumber(this.slider.levelMulti[x.id],1)
				x.dvTotalMult.innerText = "x" + displayNumber(this.slider.levelMulti[x.id] * this.slider.multi[x.id],1)
				x.dvNextLevelMult.innerText = "x" + displayNumber(next[x.id], 1) + " => x" + displayNumber(this.slider.levelMulti[x.id] * this.slider.multi[x.id] * next[x.id],1)
			})
			this.dvTitle.innerText = "等级 " + (this.slider.level || 0) + " 滑块"
		}
		this.dvLevelUpCost.innerText = "升级成本 : " + displayNumber(this.slider.levelUpCost) + " 经验" + ETAString(this.slider.levelUpCost, "exp", true) + "\n注意：升级会将滑块的统计信息重置为零"
		this.dvMultiCost.innerText = this.slider.level?"增加倍数成本 : " + displayNumber(this.slider.multiCost) + " 经验" + ETAString(this.slider.multiCost, "exp", true):""
		this.multi.map(x => {
			x.dvRaise.classList.toggle("available", this.slider.canLevel(x.id))
			x.dvRaise.classList.toggle("transparent", !this.slider.level)
		})
		this.dvLevelUpButton.classList.toggle("available", this.slider.canLevelUp())
		this.dvLevelUpButton.classList.toggle("hidden", this.slider.level == 9)
	}
}

const SliderLevelUp = Template(sliderLevelUpHandler)