    import React, { Suspense, useState, useRef, MutableRefObject, useEffect  } from 'react';
    import { Navbar, Burger, Button, Container, Group, Text, Image, Box, Slider, Select, Input, Textarea, Overlay, Popover, Grid, Notification, Tabs } from '@mantine/core';
    import { Canvas } from "@react-three/fiber";
    import { OrbitControls, Text as CustomText, OrthographicCamera } from "@react-three/drei";
    import type { OrbitControls as OrbitControlsType } from "three-stdlib";
    import { SlicerModel } from './SlicerModel';
    import { PerspectiveCamera } from "three";
    import { forwardRef } from 'react';
    import * as THREE from 'three';
    import { useMediaQuery } from "@mantine/hooks";
    import { createUserSavedSimulation } from '../../features/Simulations/getSimulationSlice';
    import { useLocation, useNavigate } from 'react-router-dom';
import ThreeJSSimulationHandler from '../threejsSimulationHandler/ThreeJSSimulationHandler';
import { getLanguageEnumByKeyAndLanguage } from '../../assets/LanguageEnums/SlicerEnumFunction';

    const heartImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-08-40-800Z.png";
    const plusImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-09-04-717Z.png";
    const mainPlus = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-09-28-633Z.png";
    const removeImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-09-49-092Z.png";
    const zoomInImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-10-10-864Z.png";
    const zoomOutImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-10-55-288Z.png";
    const rotateImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-11-15-373Z.png";
    const panImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-11-44-201Z.png";
    const resetImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-12-11-425Z.png";
    const cursorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T13-30-17-910Z.png";
    const pencilImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-13-19-736Z.png";
    const addAnnotationImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-13-41-025Z.png";
    const Anno_Cursor = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-03-24-079Z.png";
    const closeImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-03-49-741Z.png";
    const close2Img = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-04-24-192Z.png";
    const deleteImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-04-46-738Z.png";
    const editImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-05-10-206Z.png";
    const sliceImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-05-35-474Z.png";
    const searchImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-06-01-370Z.png";
    const saveasImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-06-35-845Z.png";
    const AccountIcon = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-27T10-51-25-879Z.png";
    const maincloseImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-08-49-765Z.png";
    const awsModellink=process.env.REACT_APP_AWS_MODEL_LINK;
    
    const initialNavbarItems = [
      { id: 1, name: 'Female Reproductive', img: heartImg, modelURL: 'femalereproductivesystem1.glb', active: false, },
      { id: 3, name: 'Female Reproductive 2', img: heartImg, modelURL: 'femalereproductivesystem2.glb', active: false },
      { id: 2, name: 'Mammary Gland', img: heartImg, modelURL: 'mammaryGland.glb', active: false },
      { id: 4, name: 'Ant Eater', img: heartImg, modelURL: 'anteater.glb', active: false },
      { id: 5, name: 'Bandocoot', img: heartImg, modelURL: 'bandocoot.glb', active: false },
      { id: 6, name: 'Kangaroo', img: heartImg, modelURL: 'kangaroo.glb', active: false },
      { id: 7, name: 'Koala', img: heartImg, modelURL: 'koala.glb', active: false },
      { id: 8, name: 'Mole', img: heartImg, modelURL: 'mole.glb', active: false },
      { id: 9, name: 'Sugar Glider', img: heartImg, modelURL: 'sugar_glider.glb', active: false },
      { id: 10, name: 'Tasmanian Wolf', img: heartImg, modelURL: 'tasmanian_wolf.glb', active: false },
      { id: 11, name: 'Tiger Cat', img: heartImg, modelURL: 'tigercat.glb', active: false },
      { id: 12, name: 'Wombat', img: heartImg, modelURL: 'wombat.glb', active: false },
      { id: 13, name: 'Bob Cat', img: heartImg, modelURL: 'bobcat.glb', active: false },
      { id: 14, name: 'flying Phalanger', img: heartImg, modelURL: 'flying_phalanger.glb', active: false },
      { id: 15, name: 'Mouse', img: heartImg, modelURL: 'mouse.glb', active: false },
      { id: 16, name: 'Numbat', img: heartImg, modelURL: 'numbat.glb', active: false },
      { id: 18, name: 'Turtle', img: heartImg, modelURL: 'turtle.glb', active: false },
      { id: 19, name: 'Anatomy of a muscle fibre showing a sarcomere', img: heartImg, modelURL: 'anatomy_of_a_muscle_fibre_showing_a_sarcomere.glb', active: false },
      { id: 20, name: 'Myosin monomer meromyosin', img: heartImg, modelURL: 'myosin_monomer_meromyosin.glb', active: false },
      { id: 21, name: 'An Actin thin filament', img: heartImg, modelURL: 'an_actin_thin_filament.glb', active: false },
      { id: 22, name: 'Sarcomere', img: heartImg, modelURL: 'sarcomere.glb', active: false },
      { id: 23, name: 'Angiosperm', img: heartImg, modelURL: 'angiosperms.glb', active: false },
      { id: 24, name: 'BryoPhytes', img: heartImg, modelURL: 'bryophytes.glb', active: false },
      { id: 25, name: 'Carcharodon', img: heartImg, modelURL: 'Carcharodon.glb', active: false },
      { id: 26, name: 'Catla', img: heartImg, modelURL: 'Catla.glb', active: false },
      { id: 27, name: 'Conifers', img: heartImg, modelURL: 'conifers.glb', active: false },
      { id: 28, name: 'Crocodile', img: heartImg, modelURL: 'crocodile.glb', active: false },
      { id: 29, name: 'Cycads', img: heartImg, modelURL: 'cycads.glb', active: false },
      { id: 30, name: 'Dictyota', img: heartImg, modelURL: 'dictyota.glb', active: false },
      { id: 31, name: 'Cycads', img: heartImg, modelURL: 'cycads.glb', active: false },
      { id: 32, name: 'Female Thallus', img: heartImg, modelURL: 'female_thallus.glb', active: false },
      { id: 17, name: 'Male Thallus', img: heartImg, modelURL: 'male_thallus.glb', active: false }, 
      { id: 33, name: 'Ferns', img: heartImg, modelURL: 'ferns.glb', active: false },
      { id: 34, name: 'Funaria Gametophyte and Sporophyte', img: heartImg, modelURL: 'funaria_gametophyte_and_sporophyte.glb', active: false },
      { id: 35, name: 'Fucus', img: heartImg, modelURL: 'fucus.glb', active: false },
      { id: 36, name: 'Ginkgos', img: heartImg, modelURL: 'ginkgos.glb', active: false },
      { id: 37, name: 'Hippocampus', img: heartImg, modelURL: 'Hippocampus.glb', active: false },
      { id: 38, name: 'Horsetails', img: heartImg, modelURL: 'horsetails.glb', active: false },
      { id: 39, name: 'Laminaria', img: heartImg, modelURL: 'laminaria.glb', active: false },
      { id: 40, name: 'Lizard', img: heartImg, modelURL: 'lizard.glb', active: false },
      { id: 41, name: 'Lycopods', img: heartImg, modelURL: 'lycopods.glb', active: false },
      { id: 42, name: 'mammal', img: heartImg, modelURL: 'mammal.glb', active: false },
      { id: 43, name: 'Petromyzon', img: heartImg, modelURL: 'Petromyzon.glb', active: false },
      { id: 44, name: 'porphyra', img: heartImg, modelURL: 'porphyra.glb', active: false },
      { id: 45, name: 'Pristis', img: heartImg, modelURL: 'Pristis.glb', active: false },
      { id: 46, name: 'Skulls', img: heartImg, modelURL: 'skulls.glb', active: false },
      { id: 47, name: 'Snake', img: heartImg, modelURL: 'snake.glb', active: false },
      { id: 48, name: 'Sphagnum Gametophyte', img: heartImg, modelURL: 'sphagnum_gametophyte.glb', active: false },
      { id: 49, name: 'Ulothrix', img: heartImg, modelURL: 'ulothrix.glb', active: false },
      { id: 50, name: 'Bird', img: heartImg, modelURL: 'bird.glb', active: false },
      { id: 51, name: 'Mono Cotyledons', img: heartImg, modelURL: 'monocotyledons.glb', active: false },
      { id: 52, name: 'The Hershey Chase experiment', img: heartImg, modelURL: 'The_Hershey_Chase_experiment.glb', active: false },
      { id: 53, name: 'Watson Crick', img: heartImg, modelURL: 'Watson_Crick.glb', active: false },
      { id: 54, name: 'Process of Transcription in Eukaryotes', img: heartImg, modelURL: 'Process_of_Transcription_in_Eukaryotes.glb', active: false },
      { id: 55, name: 'Process of Transcription in Bacteria', img: heartImg, modelURL: 'Process_of_Transcription_in_Bacteria.glb', active: false },
      { id: 56, name: 'Translation', img: heartImg, modelURL: 'Translation.glb', active: false },
      { id: 57, name: 'Simple distillation setup 3d model', img: heartImg, modelURL: 'Simple_distillation_setup_3d_model.glb', active: false },
      { id: 58, name: 'Experiment used to demonstrate', img: heartImg, modelURL: 'Experiment_used_to_demonstrate.glb', active: false },
      { id: 59, name: 'Apical dominance in plant', img: heartImg, modelURL: 'Apical_dominance_in_plant.glb', active: false },
      { id: 60, name: 'Dicotyledon', img: heartImg, modelURL: 'dicotyledon.glb', active: false },
      { id: 61, name: 'Mono-Cotyledon', img: heartImg, modelURL: 'monocotyledon1.glb', active: false },
      { id: 62, name: 'Cycas', img: heartImg, modelURL: 'Cycas.glb', active: false },
      { id: 63, name: 'Ginkgo', img: heartImg, modelURL: 'Ginkgo.glb', active: false },
      { id: 64, name: 'Pinus', img: heartImg, modelURL: 'Pinus.glb', active: false },
      { id: 65, name: 'Animal_Cell', img: heartImg, modelURL: 'Animal_Cell.glb', active: false },
      { id: 66, name: 'Macropus', img: heartImg, modelURL: 'Macropus.glb', active: false },
      { id: 67, name: 'Balaenoptera', img: heartImg, modelURL: 'Balaenoptera.glb', active: false },
      { id: 68, name: 'Ornithorhynchus', img: heartImg, modelURL: 'Ornithorhynchus.glb', active: false },
      { id: 69, name: 'Pteropus', img: heartImg, modelURL: 'Pteropus.glb', active: false },
      { id: 70, name: 'Octopus', img: heartImg, modelURL: 'Octopus.glb', active: false },
      { id: 71, name: 'Pila', img: heartImg, modelURL: 'Pila.glb', active: false },
      { id: 72, name: 'Human Respiratory System', img: heartImg, modelURL: 'Human_Respiratory_System.glb', active: false },
      { id: 73, name: 'Spore formation in rhyzopus', img: heartImg, modelURL: 'Spore_formation_in_rhyzopus.glb', active: false },
      { id: 74, name: 'Self pollinated flowers', img: heartImg, modelURL: 'Self-pollinated_flowers.glb', active: false },
      { id: 75, name: 'Cross pollinated flowers', img: heartImg, modelURL: 'Cross_pollinated_flowers.glb', active: false },
      { id: 76, name: 'Cleistogamous flowers', img: heartImg, modelURL: 'Cleistogamous_flowers.glb', active: false },
      { id: 77, name: 'the adapter molecule', img: heartImg, modelURL: 'the_adapter_molecule.glb', active: false },
      { id: 78, name: 'monohybrid cross', img: heartImg, modelURL: 'monohybrid_cross.glb', active: false },
      { id: 79, name: 'pea cross', img: heartImg, modelURL: 'pea_cross.glb', active: false },
      { id: 80, name: 'punett square', img: heartImg, modelURL: 'punett_square.glb', active: false },
      { id: 81, name: 'Double stranded polynucleotide chain', img: heartImg, modelURL: 'Double_stranded_polynucleotide_chain.glb', active: false },
      { id: 82, name: "Meselson and Stahl's Experimen", img: heartImg, modelURL: 'Meselson_and_Stahls_Experimen.glb', active: false },
      { id: 83, name: 'Polynucleotide chain', img: heartImg, modelURL: 'Polynucleotide_chain.glb', active: false },
      { id: 84, name: 'replicating fork', img: heartImg, modelURL: 'replicating_fork.glb', active: false },
      { id: 85, name: 'Transcription unit', img: heartImg, modelURL: 'Transcription_unit.glb', active: false },
      { id: 86, name: 'ATP synthesis ', img: heartImg, modelURL: 'atp_synthesis.glb', active: false },
      { id: 87, name: 'Elongation by the parallel line technique', img: heartImg, modelURL: 'elongation_by_the_parallel_line_technique.glb', active: false },
      { id: 88, name: 'Hydrophyl', img: heartImg, modelURL: 'hydrophyl.glb', active: false },
      { id: 89, name: 'locations of root apical meristem', img: heartImg, modelURL: 'locations_of_root_apical_meristem.glb', active: false },
      { id: 90, name: 'floral diagram', img: heartImg, modelURL: 'floral_diagram.glb', active: false },
      { id: 91, name: 'gyenocium', img: heartImg, modelURL: 'gyenocium.glb', active: false },
      { id: 92, name: 'Reflex arc', img: heartImg, modelURL: 'reflex_arc.glb', active: false },
      { id: 93, name: 'dicot', img: heartImg, modelURL: 'dicot.glb', active: false },
      { id: 94, name: 'monocot', img: heartImg, modelURL: 'monocot.glb', active: false },
      { id: 95, name: 'placentation', img: heartImg, modelURL: 'placentation.glb', active: false },
      { id: 96, name: 'Phylum annelida', img: heartImg, modelURL: 'Phylum_annelida.glb', active: false },
      { id: 97, name: 'Phylum Anthropoda+', img: heartImg, modelURL: 'Phylum_Anthropoda.glb', active: false },
      { id: 98, name: 'plant cell', img: heartImg, modelURL: 'plant_cell.glb', active: false },
      { id: 99, name: 'fission amoeba', img: heartImg, modelURL: 'fission_amoeba.glb', active: false },
      { id: 100, name: 'fission leishmania', img: heartImg, modelURL: 'fission_leishmania.glb', active: false },
      { id: 101, name: 'fragmentation', img: heartImg, modelURL: 'fragmentation.glb', active: false },
      { id: 102, name: 'multiple fission plasmodium', img: heartImg, modelURL: 'multiple_fission_plasmodium.glb', active: false },
      { id: 103, name: 'regeneration', img: heartImg, modelURL: 'regeneration.glb', active: false },
      { id: 104, name: 'digestive sysytem', img: heartImg, modelURL: 'digestive_sysytem.glb', active: false },
      { id: 105, name: 'insect pollination', img: heartImg, modelURL: 'insect_pollination.glb', active: false },
      { id: 106, name: 'pollination vallisneria', img: heartImg, modelURL: 'pollination_vallisneria.glb', active: false },
      { id: 107, name: 'Diagrammatic Representation of a Test Cross', img: heartImg, modelURL: 'diagrammatic_test_cross.glb', active: false },
      { id: 108, name: 'Monohybrid Cross in the plant Snapdragon', img: heartImg, modelURL: 'monohybrid_corss_snapdragon.glb', active: false },
      { id: 109, name: 'Dihybrid Cross (seed color and seed shape)', img: heartImg, modelURL: 'dihybrid_cross.glb', active: false },
      { id: 110, name: 'formation of recombinant DNA by action of Restriction endonuclease enzyme - EcoRI', img: heartImg, modelURL: 'ecori.glb', active: false },
      { id: 111, name: 'Diagrammatic Representation of recombinant DNA Technology', img: heartImg, modelURL: 'recombinantdna.glb', active: false },
      { id: 112, name: 'Simple Stirred-Tank bioreactor', img: heartImg, modelURL: 'simple_bioreactor.glb', active: false },
      { id: 113, name: 'Polymerase Chain reaction (PCR)', img: heartImg, modelURL: 'pcr.glb', active: false },
      { id: 115, name: 'Sparged Stirred-Tank bioreactor', img: heartImg, modelURL: 'sparged_bioreactor.glb', active: false },
      { id: 116, name: 'Cymose inflorescence', img: heartImg, modelURL: 'cymose_inflorescence.glb', active: false },
      { id: 117, name: 'Equisetum', img: heartImg, modelURL: 'Equisetum.glb', active: false },
      { id: 118, name: 'Euspongia', img: heartImg, modelURL: 'Euspongia.glb', active: false },
      { id: 119, name: 'Fern', img: heartImg, modelURL: 'fern.glb', active: false },
      { id: 120, name: 'Racemose', img: heartImg, modelURL: 'racemose.glb', active: false },
      { id: 121, name: 'Salvinia', img: heartImg, modelURL: 'salvinia.glb', active: false },
      { id: 122, name: 'Selaginella', img: heartImg, modelURL: 'Selaginella.glb', active: false },
      { id: 123, name: 'Spongilla', img: heartImg, modelURL: 'spongilla.glb', active: false },
      { id: 124, name: 'Sycon', img: heartImg, modelURL: 'sycon.glb', active: false },
      { id: 125, name: 'Adipose Tissue', img: heartImg, modelURL: 'adipose.glb', active: false },
      { id: 126, name: 'Areolar Tissue', img: heartImg, modelURL: 'areolar.glb', active: false },
      { id: 127, name: 'Blood cells', img: heartImg, modelURL: 'blood_cells.glb', active: false },
      { id: 128, name: 'Compact bone', img: heartImg, modelURL: 'compact_bone.glb', active: false },
      { id: 129, name: 'Epithelial', img: heartImg, modelURL: 'epithelial.glb', active: false },
      { id: 130, name: 'Hyaline Tissue', img: heartImg, modelURL: 'hyaline.glb', active: false },
      { id: 131, name: 'Dissected flower of Hibiscus showing Pistil, Multicarpellary, syncarpous pistil of Papaver, apocarpous gynoecium of michelia, typical anatropous ovule', img: heartImg, modelURL: 'anatropous_michele.glb', active: false },
      { id: 132, name: 'Mycropylar', img: heartImg, modelURL: 'mycropylar.glb', active: false },
      { id: 133, name: 'Stomata with bean shaped', img: heartImg, modelURL: 'stomata_with_bean_shaped.glb', active: false },
      { id: 134, name: 'Stomata with dumbell shape', img: heartImg, modelURL: 'stomata_with_dumbell_shape.glb', active: false },
      { id: 135, name: 'Vascular bundle', img: heartImg, modelURL: 'vascular_bundle.glb', active: false },
      { id: 136, name: 'Chrysophyte', img: heartImg, modelURL: 'Chrysophyte.glb', active: false },
      { id: 137, name: 'Dinoflagellate', img: heartImg, modelURL: 'dinoflagellate.glb', active: false },
      { id: 138, name: 'Euglenoids', img: heartImg, modelURL: 'Euglenoids.glb', active: false },
      { id: 139, name: 'Phycomycetes', img: heartImg, modelURL: 'Phycomycetes.glb', active: false },
      { id: 140, name: 'Slimemoulds', img: heartImg, modelURL: 'Slimemoulds.glb', active: false },
      { id: 141, name: 'Salamander', img: heartImg, modelURL: 'salamander.glb', active: false },
      { id: 142, name: 'Neophron', img: heartImg, modelURL: 'Neophron.glb', active: false },
      { id: 143, name: 'Peacock', img: heartImg, modelURL: 'peacock.glb', active: false },
      { id: 144, name: 'Parrot', img: heartImg, modelURL: 'parrot.glb', active: false },
      { id: 145, name: 'Struthio', img: heartImg, modelURL: 'Struthio.glb', active: false },
      { id: 146, name: 'Chemeleon', img: heartImg, modelURL: 'Chemeleon.glb', active: false },
      { id: 147, name: 'Chelone', img: heartImg, modelURL: 'Chelone.glb', active: false },
      { id: 148, name: 'Naja', img: heartImg, modelURL: 'Naja.glb', active: false },
      { id: 149, name: 'Imbricate', img: heartImg, modelURL: 'Imbricate.glb', active: false },
      { id: 150, name: 'Twisted', img: heartImg, modelURL: 'Twisted.glb', active: false },
      { id: 151, name: 'Valvate', img: heartImg, modelURL: 'valvate.glb', active: false },
      { id: 152, name: 'Vexillary', img: heartImg, modelURL: 'vexillary.glb', active: false },
      { id: 153, name: 'Endocrine glands female', img: heartImg, modelURL: 'endocrine_glands_female.glb', active: false },
      { id: 154, name: 'Endocrine glands male', img: heartImg, modelURL: 'endocrine_glands_male.glb', active: false },
      { id: 155, name: 'A wind-pollinated plant', img: heartImg, modelURL: 'A_wind_pollinated_plant.glb', active: false },
      { id: 156, name: 'Human Excretory System', img: heartImg, modelURL: 'Human_Excretory_System.glb', active: false },
      { id: 157, name: 'Structure of a nephron', img: heartImg, modelURL: 'Structure_of_a_nephron.glb', active: false },
      { id: 158, name: 'Female Roundworm', img: heartImg, modelURL: 'Female_Roundworm.glb', active: false },
      { id: 159, name: 'Male Roundworm', img: heartImg, modelURL: 'Male_Roundworm.glb', active: false },
      { id: 160, name: 'Liver Fluke', img: heartImg, modelURL: 'Liver_Fluke.glb', active: false },
      { id: 161, name: 'Tapeworm', img: heartImg, modelURL: 'Tapeworm.glb', active: false },
      { id: 162, name: 'Cardiac', img: heartImg, modelURL: 'cardiac.glb', active: false },
      { id: 163, name: 'Nervous.glb', img: heartImg, modelURL: 'nervous.glb', active: false },
      { id: 164, name: 'Smooth Muscles', img: heartImg, modelURL: 'smooth_muscles.glb', active: false },
      { id: 165, name: 'Cell division', img: heartImg, modelURL: 'cell_division.glb', active: false },
      { id: 166, name: 'Meisos', img: heartImg, modelURL: 'meisos.glb', active: false },
      { id: 167, name: 'Mitosis', img: heartImg, modelURL: 'mitosis.glb', active: false },
      { id: 168, name: 'Discharge of male gametes into a synergid and the movements of the sperms, one into the egg and the other into the central cell', img: heartImg, modelURL: 'Discharge_of_male_gametes.glb', active: false },
      { id: 169, name: 'Enlarged view of an egg apparatus showing entry of pollen tube into a synergid', img: heartImg, modelURL: 'enlarged_view_egg_apparatus.glb', active: false },
      { id: 170, name: 'L.S. of pistil showing path of pollen tube growth', img: heartImg, modelURL: 'pistil_pollen_tube.glb', active: false },
      { id: 171, name: 'Fertilized embryo', img: heartImg, modelURL: 'fertilized_embryo.glb', active: false },
      { id: 172, name: 'Globular embryo', img: heartImg, modelURL: 'globular_embryo.glb', active: false },
      { id: 173, name: 'Heartshaped embryo', img: heartImg, modelURL: 'heartshaped_embryo.glb', active: false },
      { id: 174, name: 'Mature', img: heartImg, modelURL: 'mature.glb', active: false },
      { id: 175, name: 'Zygote', img: heartImg, modelURL: 'zygote.glb', active: false },
      { id: 176, name: 'Chromosomal Theory of Inheritance', img: heartImg, modelURL: 'Chromosomal_Theory_of_Inheritance.glb', active: false },
      { id: 177, name: 'Independent assortment of chromosomes', img: heartImg, modelURL: 'Independent_assortment_of_chromosomes.glb', active: false },
      { id: 178, name: 'Drosophila melanogastermale female', img: heartImg, modelURL: 'Drosophila_melanogastermale_female.glb', active: false },
      { id: 179, name: 'Drosophila melanogastermale male', img: heartImg, modelURL: 'Drosophila_melanogastermale_male.glb', active: false },
      { id: 180, name: 'Diagrammatic representation of decomposition cycle', img: heartImg, modelURL: 'decomposition_cycle.glb', active: false },
      { id: 181, name: 'Energy flow through different trophic levels', img: heartImg, modelURL: 'Energy_flow_trophic_levels.glb', active: false },
      { id: 182, name: 'Electrostatic precipitator (Animation)', img: heartImg, modelURL: 'Electrostatic_precipitator.glb', active: false },
      { id: 183, name: 'Biomagnification of DDT in an aquatic food chain', img: heartImg, modelURL: 'Biomagnification_DDT.glb', active: false },
      { id: 184, name: 'Ozone hole is the area above Antarctica', img: heartImg, modelURL: 'Ozone_hole_Antarctica.glb', active: false },
      { id: 185, name: 'Fluid mosaic model of plasma membrane', img: heartImg, modelURL: 'plasma_membrane.glb', active: false },
      { id: 186, name: 'Endoplasmic reticulum', img: heartImg, modelURL: 'Endoplasmic_reticulum.glb', active: false },
      { id: 187, name: 'Golgi apparatus', img: heartImg, modelURL: 'Golgi_apparatus.glb', active: false },
      { id: 188, name: 'Electron Transport System (ETS) (Animation)', img: heartImg, modelURL: 'Electron_Transport_System.glb', active: false },
      { id: 189, name: 'Diagram showing sagital section of the human brain', img: heartImg, modelURL: 'sagital_section_human_brain.glb', active: false },
      { id: 190, name: 'Diagrammatic view of the position of Thyroid and Parathyroid', img: heartImg, modelURL: 'Thyroid_and_Parathyroid.glb', active: false },
    ];

    interface SelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
      image: string;
      label: string;
    }
    interface Annotation {
      position: { x: number; y: number; z: number };
      normal: { x: number; y: number; z: number };
      id: number;
      title: string;
    }

    function SlicerModelSimulation() {
      const location = useLocation();
      const isSmallScreen = useMediaQuery("(max-width: 768px)");
      const isMediumScreen = useMediaQuery("(max-width: 1072px)");
      const [opened, setOpened] = useState(false);
      const [isModelClicked, setModelClicked] = useState(false);
      const [modelPath, setModelPath] = useState("");
      const [navbarItems, setNavbarItems] = useState(initialNavbarItems);
      const [activeModelTitle, setModelTitle] = useState<string>("");
      const [panEnable, setPanEnable] = useState<boolean>(true);
      const [rotateEnable, setRotateEnable] = useState<boolean>(true);
      const controlsRef = useRef<OrbitControlsType>(null);
      const cameraRef = useRef<PerspectiveCamera | null>(null) as MutableRefObject<PerspectiveCamera | null>;
      const [isAnnotationMode, setAnnotationMode] = useState<boolean>(false);
      const [isCursorOn, setCursorOn] = useState<boolean>(true);
      const [addingAnnotation, setAddingAnnotation] = useState<boolean>(false);
      const [selectedModelId, setSelectedModelId]  = useState<number | null>(null);
      const [popupVisible, setPopupVisible] = useState(false);
      const [annotationData, setAnnotationData] = useState<{ title: string, description: string }>({ title: '', description: '' });
      const [currentAnnotation, setCurrentAnnotation] = useState<THREE.Vector3 | null>(null);
      const [annotations, setAnnotations] = useState<{ id: number, position: THREE.Vector3, title: string, description: string, normal: THREE.Vector3 }[]>([]);
      const [currentAnnotationId, setCurrentAnnotationId] = useState< number>(0);
      const [showTitleError, setShowTitleError] = useState(false); 
const [currentAnnotationNormal, setCurrentAnnotationNormal] = useState<THREE.Vector3 | null >(null);
const [currentpopupannoation, setcurrentPopUp] = useState<number | null>(null)
const [selectedAnnotation, setSelectedAnnotation] = useState<{ id: number, title: string, description: string }>({ id: 0, title: '', description: '' });
const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
const [isSlicing, setisSlicing] = useState<boolean>(false);
const [drawingMode, setDrawingMode] = useState(false);
const [isDrawing, setIsDrawing] = useState(false);
const [lastPosition, setLastPosition] = useState<{ x: number; y: number; } | null>(null);
const [isResetted, setIsResetted] = useState<boolean>(false);
const [isSearchModel, setModelSearch] = useState<boolean>(false);
const [saveBoxVisible, setBoxVisible] = useState<boolean>(false);
const [ChangedMeshPositions, setChangedMeshPositions] = useState<Map<number, THREE.Vector3>>(new Map());
const [isSave, setIsSave] = useState<boolean>(false);
const [saveTitle, setSaveTitle] = useState<string |null>(null);
const [isExit, setisExit] = useState<boolean>(false);
const [jsonMeshPosition, setJsonMeshPosition] = useState<string>("");
const [isSaved, setisSaved] = useState<boolean>(false);
const [editannotation, setEditAnnotation] = useState<boolean>(false);
const [editAnnotationData, setEditAnnotationData] = useState<{ id: number, title: string, description: string }>({ id: 0, title: '', description: '' });
const [successmessage, setSuccessmessage] = useState<boolean>(false);
const [errorMessage, setErrormessage] = useState<boolean>(false)
const [zoomValue, setZoomValue] = useState<number>(100);
const [issavedSimulation, setSavedSimulation] = useState<boolean>(false);
const [panNoti, setPanNoti] = useState<boolean>(false);
const [isAccountOpen, setAccountOpen] = useState<boolean>(false);
const [userLanguage, setUserLanguage] = useState<string>('en');
const dataFromState = location.state && location.state.data;
const navigate = useNavigate();
const pathParts = window.location.pathname.split('/');
const sim_id = pathParts[pathParts.length - 1];

useEffect(()=>{
  if(panNoti){
    setTimeout(() => {
        setPanNoti(false);
    }, 5000);
  }
},[panNoti])

useEffect(()=>{
if(panEnable){
  setPanNoti(true);
}
},[panEnable])

// useEffect(()=>{
// if(isSlicing){
//   if (controlsRef.current) {
//     controlsRef.current.reset();
//   }
// }
// },[isSlicing])

useEffect(()=>{
  if(dataFromState?.simulationId?._id == "Anatomy3DBuilderMega"){
    setSavedSimulation(true);
  initialNavbarItems.map((item)=>{
    if(item.id === dataFromState.data.activeItemId){
      setModelPath((awsModellink + item.modelURL)); 
      setSelectedModelId(item.id);
      setModelTitle(item.name);
      setModelClicked(true);
    }
  })
  setUserLanguage(dataFromState.data.userLanguage)
  deserializedMeshPosition(dataFromState.data.modelchangedPosition);
  const parsedAnno = JSON.parse(dataFromState.data.modelannotations);
  setAnnotationMode(true);
  const parsedAnnotationsWithVector3 = parsedAnno.map( (annotation: Annotation) => ({
    ...annotation,
    position: new THREE.Vector3(annotation.position.x, annotation.position.y, annotation.position.z),
    normal: new THREE.Vector3(annotation.normal.x, annotation.normal.y, annotation.normal.z)
  }));
  setAnnotations(parsedAnnotationsWithVector3);
  setCurrentAnnotationId(parsedAnnotationsWithVector3.length)
  }

},[dataFromState])

useEffect(() => {
  const canvas = drawCanvasRef.current;
if (canvas) {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
}, [drawingMode]);


const handleMouseWheel = (event: any )=>{
  if(zoomValue >= 50 && zoomValue <=150){
    setZoomValue(zoomValue + Math.floor(event.deltaY/15));
  }else if(zoomValue < 50 && event.deltaY > 0){
    setZoomValue(zoomValue + Math.floor(event.deltaY/15));
  }else if(zoomValue > 150 && event.deltaY < 0){
    setZoomValue(zoomValue + Math.floor(event.deltaY/15));
  }
}

const handleMouseDown = (event: React.MouseEvent) => {
  if (drawingMode) {
    setIsDrawing(true);
    setLastPosition({ x: event.clientX, y: event.clientY });
  }
};

const handleMouseUp = () => {
  if (drawingMode) {
    setIsDrawing(false);
    setLastPosition(null);
  }
};

const handleMouseMove = (event: React.MouseEvent) => {
  if (isDrawing && drawingMode && lastPosition) {
    const canvas = drawCanvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.strokeStyle = "black";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(lastPosition.x, lastPosition.y);
      context.lineTo(event.clientX, event.clientY);
      context.stroke();
      setLastPosition({ x: event.clientX, y: event.clientY });
    }
  }
};

const handlePencilclick=()=>{
  setDrawingMode(!drawingMode);
}

    const addAnnotation = (point: THREE.Vector3, normal:THREE.Vector3 ) => {
        setCurrentAnnotation(point);
        setCurrentAnnotationNormal(normal);
        setShowTitleError(false);
        setPopupVisible(true);
    };

    const handleAddToModel = () => {
      if (annotationData.title.trim() === "") {
          setShowTitleError(true);
      } else if (currentAnnotation && currentAnnotationNormal) {
          const newAnnotation = {
              id: currentAnnotationId + 1,
              position: currentAnnotation,
              normal: currentAnnotationNormal, 
              title: annotationData.title,
              description: annotationData.description,
          };
          setAnnotations([...annotations, newAnnotation]);
          setCurrentAnnotationId(currentAnnotationId + 1);
          setPopupVisible(false);
      }
      setAnnotationData({ title: '', description: '' });
  };

 const handleFileClick = ()=>{
  setBoxVisible(!saveBoxVisible);
  setIsResetted(false);
 }
    

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAnnotationData({ ...annotationData, title: event.target.value });
  };
  
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAnnotationData({ ...annotationData, description: event.target.value });
  };
  const handleclosebutton = ()=>{
    setIsSave(false);
    setPopupVisible(false);
    setShowTitleError(false);
    setAnnotationData({ title: '', description: '' });
    setSaveTitle(null)
  }
    
  const handleDeleteAnnotation = (id: number) => {
    setAnnotations(prevAnnotations => prevAnnotations.filter(annotation => annotation.id !== id));
    setcurrentPopUp(null);
  };
      var cursorStyle = {
        cursor: addingAnnotation ? `url(${Anno_Cursor}), auto` : isSlicing ? `url(${sliceImg}), auto`: 'default'
      };
      var pencilStyle={
        cursor: drawingMode ? `url(${pencilImg}), auto`: 'default'
      }
      

      const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
        ({ image, label, ...others }: SelectItemProps, ref) => (
          <div ref={ref} {...others}>
            <Group noWrap>
              <Image src={image} width={20} height={20} alt={label}
              style={{ filter: image === cursorImg ? 'invert(1)' : 'none' }}   />
              <div> 
                <Text>{label}</Text>
              </div>
            </Group>
          </div>
        )
      );
      SelectItem.displayName = 'SelectItem';

      
      const handleMiddelPlus = () => {
        setModelSearch(true);
      };
      const handledescCloseButton = ()=>{
        setcurrentPopUp(null);
      }

      const handleNavbarClick = (id: number) => {
        setAddingAnnotation(false);
      setModelSearch(false);
      setBoxVisible(false);
        if (selectedModelId === null || selectedModelId === id) {
          if((annotations.length >= 1 || ChangedMeshPositions.size > 0) && !isSaved){
            setisExit(true);
          }else{
            const updatedItems = navbarItems.map(item =>
              item.id === id ? { ...item, active: !item.active } : { ...item, active: false }
            );
            setNavbarItems(updatedItems);
            const selectedItem = updatedItems.find(item => item.id === id && item.active);
            if (selectedItem) {
              setPanEnable(true);
              setRotateEnable(true);
              setModelPath((awsModellink + selectedItem.modelURL));
              setSelectedModelId(id);
              setModelTitle(selectedItem.name);
              setModelClicked(true);
            } else {
              setJsonMeshPosition("");
                setAnnotationMode(false);
                setModelPath("");
                setModelTitle("");
                setSelectedModelId(null);
                setModelClicked(false);
                setAnnotations([]);
                setisSlicing(false);
                setChangedMeshPositions(new Map());
                handleResetButton()
            }
          }
          
        }
      };

      const handlePanButton = ()=>{
        setPanEnable(!panEnable);
      }
      const handleRotateButton = ()=>{
        setRotateEnable(!rotateEnable);
      }

      const handleResetButton = ()=>{
        setIsResetted(true);
        setisSlicing(false);
        setRotateEnable(false);
        setPanEnable(false);
        setDrawingMode(false);
        setAddingAnnotation(false);
        setDrawingMode(false);
        setJsonMeshPosition("");
        setBoxVisible(false);
        const canvas = drawCanvasRef.current;
        if (canvas) {
          const context = canvas.getContext("2d");
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
        if (controlsRef.current) {
          controlsRef.current.reset();
        }
      }

    const handleZoomChange = (value: number) => {
      const newFov = 80 + value;
      setZoomValue(50+ value);
    };

    const handleModeChange = (value: string) => {
      if (value === 'object_mode') {
        setAnnotationMode(false);
      setAddingAnnotation(false);
      } else if (value === 'annotation_mode') {
        setAnnotationMode(true);
        setDrawingMode(false);
      }
    };
    const handleCursorSelection = ()=>{
      setCursorOn(!isCursorOn);
      setAddingAnnotation(false);
    }
    const handleAnnotationAddingButton = ()=>{
      setAddingAnnotation(!addingAnnotation);
    }

    const handleSliceSelection  = ()=>{
      setisSlicing(!isSlicing);
      setPanEnable(false);
      setRotateEnable(false);
      setIsResetted(false);
    }
    const handleaddmodelclose= ()=>{
      setModelSearch(false);
    }

    const setChangedMesh=(newPositions: Map<number, THREE.Vector3>)=>{
      setChangedMeshPositions(newPositions)
    }
useEffect(()=>{
  const serializedData = Array.from(ChangedMeshPositions.entries()).map(([key, vector3]) => ({
    key,
    value: {
      x: vector3.x,
      y: vector3.y,
      z: vector3.z,
    },
  }));
  const jsonData = JSON.stringify(serializedData);
  setJsonMeshPosition(jsonData);
},[ChangedMeshPositions])

    const stringifyedMeshPosition = (name: string)=>{
      const serializedData = Array.from(ChangedMeshPositions.entries()).map(([key, vector3]) => ({
        key,
        value: {
          x: vector3.x,
          y: vector3.y,
          z: vector3.z,
        },
      }));
      const jsonData = JSON.stringify(serializedData);
      if(jsonData == jsonMeshPosition){
        const anno = JSON.stringify(annotations);
        const modelData = {
          modelChangedName: name,
          modelchangedPosition: jsonData,
          modelannotations: anno,
          activeItemId: selectedModelId,
          userLanguage: userLanguage,
        }
        const requestedData = {
          name: name,
          simulationId: "Anatomy3DBuilderMega",
          data: modelData,
        }
        createUserSavedSimulation(requestedData).then((data)=>{
          setSuccessmessage(true);
          setTimeout(() => {
            setSuccessmessage(false);
          }, 4000);
        }).catch((err)=>{
          setErrormessage(true);
          setTimeout(() => {
            setErrormessage(false);
          }, 4000);
        })
      }
      
    }

    const deserializedMeshPosition = (jsonData: string)=>{
      const parsedData = JSON.parse(jsonData);
      const deserializedMap = new Map<number, THREE.Vector3>();
      parsedData.forEach((item: any) => {
        const { key, value } = item;
        const vector3 = new THREE.Vector3(value.x, value.y, value.z);
        deserializedMap.set(key, vector3);
      });
      setChangedMeshPositions(deserializedMap);
    }

    useEffect(()=>{

    },[ChangedMeshPositions])

    const handleSaveClick = ()=>{
      setSaveTitle(activeModelTitle);
      stringifyedMeshPosition(activeModelTitle);
      setisSaved(true);
      setBoxVisible(false);
    }

    const handleSaveAsClick=()=>{
      setIsSave(true);
      setBoxVisible(false);
    }
    const handleSaveAsSubmit = ()=>{
      stringifyedMeshPosition(saveTitle ?? activeModelTitle)
      setIsSave(false);
      setisSaved(true);
    }
    const handleSaveTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSaveTitle(event.target.value)
  };

  const handleQuitButton = ()=>{
    setAnnotationMode(false);
    setModelPath("");
    setModelTitle("");
    setSelectedModelId(null);
    setModelClicked(false);
    setAnnotations([]);
    setChangedMeshPositions(new Map());
    setisSaved(false);
    setisExit(false);
    setisSlicing(false);
    handleResetButton()
    setJsonMeshPosition("");
    const updatedItems = navbarItems.map(item =>
      item.active === true ? { ...item, active: !item.active } : { ...item, active: false }
    );
    setNavbarItems(updatedItems);
  }

  const handleeditAnnotation = (id: number)=>{
    setEditAnnotation(true);
    setEditAnnotationData({id: id, title: selectedAnnotation.title, description: selectedAnnotation.description})
  }
  const handleDescriptionEdit = (event: React.ChangeEvent<HTMLTextAreaElement>)=>{
    setEditAnnotationData({ ...editAnnotationData, description: event.target.value });
  }
  
  const handleTitleEdit = (event: React.ChangeEvent<HTMLInputElement>)=>{
    setEditAnnotationData({ ...editAnnotationData, title: event.target.value });
  }
  const handleresetedit=()=>{
    setEditAnnotationData({id: 0, title: '', description: ''});
    setEditAnnotation(false);
  }
  const handleEditAnnoSave = ()=>{
    setSelectedAnnotation(editAnnotationData);
    const index = annotations.findIndex(item => item.id === editAnnotationData.id);
    if (index !== -1) {
      const updatedAnnotations = [...annotations];
      updatedAnnotations[index] = {
        ...updatedAnnotations[index],
        title: editAnnotationData.title,
        description: editAnnotationData.description
      };
      setAnnotations(updatedAnnotations);
    }
    setEditAnnotation(false);
  }

  
  const handleBackButton = ()=>{
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    const newPathname = segments.slice(0, -2).join('/');
    navigate(`${newPathname}`);
}

return (
        <Box style={{ height: '100vh', width: '100vw', position: 'relative', backgroundColor: '#D9DEE8',  ...cursorStyle }}>
           <ThreeJSSimulationHandler sim_id={sim_id} data={dataFromState} />
          {isAccountOpen && <>
          <Overlay opacity={0.8} color='#000' zIndex={1001} onClick={()=>setAccountOpen(false)}/>
          <Box style={{position: 'absolute', top: '50%', left: '50%',zIndex: 1001, transform: 'translate(-50%, -50%)', backgroundColor: 'white', 
            padding: '20px', width: '400px', height: '250px', borderRadius: '15px'}}>
              <Box sx={{width: '100%',display: 'flex', justifyContent : 'space-between', height: '25%'}}>
                  <Text sx={{fontWeight: 700, fontSize: '25px'}}>{getLanguageEnumByKeyAndLanguage({ key: 'Preferences', LanguageId: userLanguage}) }</Text>
                  <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={()=>setAccountOpen(false)}
                 src={closeImg} width={15} height={15} />
                 </Box>
              </Box>
              <Box sx={{height: '70%', width: '100%'}}>
              <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">{getLanguageEnumByKeyAndLanguage({ key: "Overview", LanguageId: userLanguage}) }</Tabs.Tab>
        <Tabs.Tab value="languages">{getLanguageEnumByKeyAndLanguage({ key: "Languages", LanguageId: userLanguage}) }</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="overview" pt="lg">
      <Text>{getLanguageEnumByKeyAndLanguage({ key: "Preference_Content", LanguageId: userLanguage})}</Text>
      </Tabs.Panel>
      <Tabs.Panel value="languages" pt="lg">
              <Box sx={{width: '100%', height: '70px', border: '2px solid black', borderRadius :'10px', padding: '7px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
              <Button style={{borderRadius: '10px', height: '100%', width: '45%', border: '1px solid transparent', backgroundColor: userLanguage =='en' ? '#BACEF4' : 'transparent' }}
               variant='outline' onClick={()=>setUserLanguage('en')}>
                <Text sx={{fontSize: '22px'}} fw={700} c='black'>English</Text>
                </Button>
                <Button style={{borderRadius: '10px', height: '100%', width: '45%', border: '1px solid transparent', backgroundColor: userLanguage =='hi' ? '#BACEF4' : 'transparent'}}
                 variant='outline' onClick={()=>setUserLanguage('hi')}>
                <Text sx={{fontSize: '22px'}} fw={700} c='black'>हिंदी</Text>
                </Button>
              </Box>
      </Tabs.Panel>
    </Tabs>
              </Box>
          </Box>
          </>}
                {isSave && <>
                  <Overlay
                      opacity={0.8}
                      color="#000"
                      zIndex={1001}
                    />
                    <Box
                 style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'white',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  zIndex: 1001,
                  cursor: 'pointer',
                  width: '20%',
                  }}>
                      <Box style={{marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'top'}}>
                <Text size={25} weight={700} style={{marginBottom: '15px'}}>{getLanguageEnumByKeyAndLanguage({ key: "Save_As", LanguageId: userLanguage}) }</Text>
                <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={handleclosebutton}
                 src={closeImg} width={15} height={15} />
                 </Box>
                </Box>
                <Text size='lg' mb={10}>{activeModelTitle}</Text>
                <Input
                    placeholder= {getLanguageEnumByKeyAndLanguage({ key: "Name", LanguageId: userLanguage}) }
                    value={saveTitle ?? ""}
                    onChange={handleSaveTitleChange}
                    style={{ marginTop: '2px', marginBottom: '10px' }}
                />
                    <Box  style={{ marginTop: '35px', display: 'flex', justifyContent: 'end', alignItems: 'end'  }}>
                    <Button style={{borderRadius: '20px', width: '70px', marginRight: '10px',  padding: '0', border: '1px solid #4B65F6', color:'#4B65F6' }} onClick={() => setIsSave(false)} variant='outline'>{getLanguageEnumByKeyAndLanguage({ key: "Cancel", LanguageId: userLanguage}) }</Button>
                    <Button style={{borderRadius: '20px', width: '120px', padding: '0', backgroundColor: '#4B65F6'}} onClick={handleSaveAsSubmit} color="blue">{getLanguageEnumByKeyAndLanguage({ key: "Save_Simulation", LanguageId: userLanguage}) }</Button>
                </Box>
        </Box></>}
        {isExit && <>
                  <Overlay
                      opacity={0.8}
                      color="#000"
                      zIndex={1001}
                    />
                    <Box
                 style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'white',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  zIndex: 1001,
                  cursor: 'pointer',
                  width: '25%',
                  }}>
                      <Box style={{marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'top'}}>
                <Text size={25} weight={700} style={{marginBottom: '15px'}}>{getLanguageEnumByKeyAndLanguage({ key: "Remove_Model", LanguageId: userLanguage}) }</Text>
                <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={()=> setisExit(false)}
                 src={closeImg} width={15} height={15} />
                 </Box>
                </Box>
                <Text size='lg' mb={10}>{getLanguageEnumByKeyAndLanguage({ key: "Quit_Message", LanguageId: userLanguage}) }</Text> 
                    <Box  style={{ marginTop: '35px', display: 'flex', justifyContent: 'end', alignItems: 'end'  }}>
                    <Button style={{borderRadius: '20px', width: '70px', marginRight: '10px',  padding: '0', border: '1px solid #4B65F6', color:'#4B65F6' }} onClick={()=> setisExit(false)} variant='outline'>{getLanguageEnumByKeyAndLanguage({ key: "Cancel", LanguageId: userLanguage}) }</Button>
                    <Button style={{borderRadius: '20px', width: '120px', padding: '0', backgroundColor: '#4B65F6'}} onClick={handleQuitButton} color="blue">{getLanguageEnumByKeyAndLanguage({ key: "Remove", LanguageId: userLanguage}) }</Button>
                </Box>
        </Box></>}
        {editannotation && (
            <>
            <Overlay
                      opacity={0.8}
                      color="#000"
                      zIndex={1001}
                    />
            <Box
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    zIndex: 1001,
                    cursor: 'pointer',
                    width: '20%'
                }}
            >
              <Box style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'top'}}>
                <Text size="lg" weight={500} style={{marginBottom: '20px'}}>{getLanguageEnumByKeyAndLanguage({ key: "Edit_Annotation", LanguageId: userLanguage}) }</Text>
                <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={handleresetedit}
                 src={closeImg} width={15} height={15} />
                 </Box>
                </Box>
              <Text>
              {getLanguageEnumByKeyAndLanguage({ key: "Title", LanguageId: userLanguage}) }
              </Text>
                <Input
                    placeholder="Title"
                    value={editAnnotationData.title}
                    onChange={handleTitleEdit}
                    style={{ marginTop: '2px', marginBottom: '10px' }}
                />
                <Text>
                {getLanguageEnumByKeyAndLanguage({ key: "Description", LanguageId: userLanguage})}
                </Text>
                <Textarea
                    placeholder={getLanguageEnumByKeyAndLanguage({ key: "Anno_Desc", LanguageId: userLanguage}) }
                    value={editAnnotationData.description}
                    onChange={handleDescriptionEdit}
                    style={{ marginTop: '2px', marginBottom: '10px' }}
                    minRows={6}
                />
                <Box  style={{ marginTop: '15px', display: 'flex', justifyContent: 'end', alignItems: 'end'  }}>
                    <Button style={{borderRadius: '20px', width: '70px', marginRight: '10px',  padding: '0', border: '1px solid #4B65F6', color:'#4B65F6' }} onClick={handleresetedit} variant='outline'>{getLanguageEnumByKeyAndLanguage({ key: "Cancel", LanguageId: userLanguage}) }</Button>
                    <Button style={{borderRadius: '20px', width: '120px', padding: '0', backgroundColor: '#4B65F6'}} onClick={handleEditAnnoSave} color="blue">{getLanguageEnumByKeyAndLanguage({ key: "Save_Edit", LanguageId: userLanguage}) }</Button>
                </Box>
            </Box>
            </>
        )}
           {popupVisible && (
            <>
            <Overlay
                      opacity={0.8}
                      color="#000"
                      zIndex={1001}
                    />
            <Box
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    zIndex: 1001,
                    cursor: 'pointer',
                    width: '20%'
                }}
            >
              <Box style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'top'}}>
                <Text size="lg" weight={500} style={{marginBottom: '20px'}}> {getLanguageEnumByKeyAndLanguage({ key: "Add_Annotation", LanguageId: userLanguage}) }</Text>
                <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={handleclosebutton}
                 src={closeImg} width={15} height={15} />
                 </Box>
                </Box>
                {showTitleError && (
              <Text color="red" >{getLanguageEnumByKeyAndLanguage({ key: "Title_Error", LanguageId: userLanguage})}</Text>
            )}
              <Text>
              {getLanguageEnumByKeyAndLanguage({ key: "Title", LanguageId: userLanguage}) }
              </Text>
                <Input
                    placeholder={getLanguageEnumByKeyAndLanguage({ key: "Title", LanguageId: userLanguage}) }
                    value={annotationData.title}
                    onChange={handleTitleChange}
                    style={{ marginTop: '2px', marginBottom: '10px' }}
                />
                <Text>
                {getLanguageEnumByKeyAndLanguage({ key: "Description", LanguageId: userLanguage}) }
                </Text>
                <Textarea
                    placeholder={getLanguageEnumByKeyAndLanguage({ key: "Anno_Desc", LanguageId: userLanguage}) }
                    value={annotationData.description}
                    onChange={handleDescriptionChange}
                    style={{ marginTop: '2px', marginBottom: '10px' }}
                    minRows={6}
                />
                <Box  style={{ marginTop: '15px', display: 'flex', justifyContent: 'end', alignItems: 'end'  }}>
                    <Button style={{borderRadius: '20px', width: '70px', marginRight: '10px',  padding: '0', border: '1px solid #4B65F6', color:'#4B65F6' }} onClick={() => setPopupVisible(false)} variant='outline'>{getLanguageEnumByKeyAndLanguage({ key: "Cancel", LanguageId: userLanguage})}</Button>
                    <Button style={{borderRadius: '20px', width: '120px', padding: '0', backgroundColor: '#4B65F6'}} onClick={handleAddToModel} color="blue"> {getLanguageEnumByKeyAndLanguage({ key: "Add_to_model", LanguageId: userLanguage})}</Button>
                </Box>
            </Box>
            </>
        )}
        {!issavedSimulation && <>
          <Group position="apart" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1000,
            backgroundColor: '#3174F3',
            width: opened ? isSmallScreen ? "250px" : '300px' : '60px',
            height: '60px',
          }}>
            <Burger
              color="white"
              size={30}
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              style={{
                backgroundColor: '#3174F3',
                top: 10,
                left: 10,
                position: 'absolute',
              }}
            />
            {opened && (
              <Text style={{
                top: 10,
                marginLeft: isSmallScreen ? "70px" :  '100px',
                fontSize: '24px',
                color: 'white',
                lineHeight: '34px',
                backgroundColor: '#3174F3',
              }}>
                {getLanguageEnumByKeyAndLanguage({ key: "D_models", LanguageId: userLanguage})}
              </Text>
            )}
          </Group></> }
          {opened && (
            <Navbar width={{ base: isSmallScreen ? "250px" : '300px' }} height="100vh" sx={{ position: 'absolute', top: 0, left: 0, zIndex: 999, backgroundColor: 'white' }}>
              <Navbar.Section grow style={{ marginTop: '60px', scrollbarWidth: "thin", overflowY: "auto", maxHeight: '87vh' }}>
              {navbarItems.map((item) => (
                  <>
                  {item.active == true && 
                  <Box key={item.id}
                    onClick={() => handleNavbarClick(item.id)}
                    sx={{
                      padding: '10px',
                      minHeight: '8vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '2px solid black',
                      cursor: selectedModelId === null || selectedModelId === item.id ? 'pointer' : 'default',
                      opacity: selectedModelId !== null && selectedModelId !== item.id ? 0.5 : 1,
                      backgroundColor: item.active ? '#3174F3' : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedModelId === null || selectedModelId === item.id ? '#f0f0f0' : 'transparent',
                      },
                    }}
                  >
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                      <Image src={item.img} width={40} height={40} alt={item.name} />
                      <Text size="lg" style={{ paddingLeft: '10px', color: item.active ? 'white' : 'black' }}>{item.name}</Text>
                    </Box>
                    <Image src={item.active ? removeImg : plusImg} width={25} height={25} alt={item.active ? "Remove" : "Add"} style={{ cursor: 'pointer' }} />
                  </Box>}
                  </>
                ))}

                {navbarItems.map((item) => (
                  <>
                  {item.active == false && 
                  <Box key={item.id}
                    onClick={() => handleNavbarClick(item.id)}
                    sx={{
                      padding: '10px',
                      minHeight: '8vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '2px solid black',
                      cursor: selectedModelId === null || selectedModelId === item.id ? 'pointer' : 'default',
                      opacity: selectedModelId !== null && selectedModelId !== item.id ? 0.5 : 1,
                      backgroundColor: item.active ? '#3174F3' : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedModelId === null || selectedModelId === item.id ? '#f0f0f0' : 'transparent',
                      },
                    }}
                  >
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                      <Image src={item.img} width={40} height={40} alt={item.name} />
                      <Text size="lg" style={{ paddingLeft: '10px', color: item.active ? 'white' : 'black' }}>{item.name}</Text>
                    </Box>
                    <Image src={item.active ? removeImg : plusImg} width={25} height={25} alt={item.active ? "Remove" : "Add"} style={{ cursor: 'pointer' }} />
                  </Box>}
                  </>
                ))}
              </Navbar.Section>
              <Navbar.Section style={{height: '13vh'}}>
                <Button onClick={handleMiddelPlus} fullWidth style={{ backgroundColor: '#3174F3', color: 'white', opacity: selectedModelId ? 0.5 : 1 }}>{getLanguageEnumByKeyAndLanguage({ key: "View_All", LanguageId: userLanguage}) }  </Button>
              </Navbar.Section>
            </Navbar>
          )}
          {!isModelClicked && 
            <Container
              fluid
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box sx={{ padding: 0, margin: 0 }} >
                <img src={mainPlus} width={100} height={100} style={{ cursor: 'pointer' }} onClick={handleMiddelPlus}></img>
                <Text weight={800}>{getLanguageEnumByKeyAndLanguage({ key: "Add_3D_Model", LanguageId: userLanguage}) }</Text>
              </Box>
            </Container>
          }
          {(isSearchModel && !isModelClicked) &&  <>
            <Overlay opacity={0.8} color="#000" zIndex={1001} />
               <Box style={{padding: '10px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',width: isSmallScreen ?"300px" : '60%', height: isSmallScreen?"500px": '85%', 
                zIndex: 1002, backgroundColor: 'white', borderRadius: '10px'}}>
                  <Box style={{padding: isSmallScreen ?"5px 10px" : '10px',marginRight: '10px', display: 'flex', justifyContent: 'space-between' ,alignItems: 'center', maxHeight: '15%', overflowY: 'clip' }}>
                    <Text size={isMediumScreen ?13: 20} weight={600}>{getLanguageEnumByKeyAndLanguage({ key: "Add_Model", LanguageId: userLanguage})}</Text>
                    <Input
                        icon={<img src={searchImg} width={20} height={20} />}
                        placeholder={getLanguageEnumByKeyAndLanguage({ key: "Search_Model", LanguageId: userLanguage}) }/>
  
                    <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={handleaddmodelclose}
                 src={closeImg} width={15} height={15} />
                 </Box>
                  </Box>  
                  <Box style={{margin: isMediumScreen ? "5px 20px" :'20px', height: '85%',overflowY: "auto", scrollbarWidth: 'thin', overflowX: 'hidden'}}>
                  <Grid grow gutter="xl">
                      {initialNavbarItems.map((items)=>(
                      <Grid.Col span={isSmallScreen ? 12 : 4}>
                      <Box sx={{'&:hover': {
                        opacity: 0.5,
                      },}}
                       onClick={() => handleNavbarClick(items.id)} style={{ height: isMediumScreen ? "140px": '200px', border: '2px solid gray', borderRadius: '10px', marginLeft: '18px',}}>
                          <Box style={{width: '100%', height: '70%', backgroundColor: 'lightblue', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src={heartImg} width='50%' height='50%' />
                          </Box>
                          <Box style={{width: '100%', height: '30%', borderTop: '2px solid white', overflowY: 'auto', scrollbarWidth: 'thin'}}>
                              <Text lh={1.1} ml={8} mt={5} mr={1}>{items.name}</Text>
                          </Box>
                      </Box>
                    </Grid.Col>
                      ))}
                  </Grid>
                  </Box>
                </Box>     
                     </>}
          {isModelClicked && 
            <>
  <Box sx={{position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 10}}>
      <Button onClick={handleBackButton } variant='outline' style={{padding: 0, border: '0.1px solid transparent'}}>
          <img src={maincloseImg} alt="building" style={{ width: 35, height:  35,}} />
        </Button>
        <Button onClick={()=>setAccountOpen(true)} variant='outline' style={{ padding: 0, width: 50, height: 50, border: '0.1px solid transparent', }}>
          <img src={AccountIcon} alt="AccountIcon" style={{width: '100%', height: '100%', objectFit: 'cover', }} />
        </Button>
        </Box>
        <canvas
        ref={drawCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: drawingMode ? "auto" : "none",
          display: drawingMode ? "block" : "none",
          zIndex: 997, ...pencilStyle
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    
            {  (currentpopupannoation && !addingAnnotation) && 
                <Box
                style={{
                  zIndex: 998,
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0px',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  width: '20vw',
                  height: '50%',
                }}
              >

                <Box
                style={{backgroundColor: '#4B65F6', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                <Text pl={10} weight={800} size={25} color='white'>{selectedAnnotation.title}</Text>
                <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={handledescCloseButton}
                 src={close2Img} width={15} height={15} />
                 </Box>
                </Box>

                <Button variant='outline' style={{padding: 0, width:80, marginRight: '10px', marginLeft: '10px', color: 'black', border: '1px solid  black' }}
                onClick={()=>handleeditAnnotation(selectedAnnotation.id)}>
                  <img width={25} height={25} src={editImg} />
                  <Text ml={5} size={18}>
                  {getLanguageEnumByKeyAndLanguage({ key: "Edit", LanguageId: userLanguage})}
                  </Text>
                </Button>
                <Button variant='outline' style={{padding: 0, width:100, color: 'black',  border: '1px solid  black' }}
                onClick={() => handleDeleteAnnotation(selectedAnnotation.id)}>
                  <img width={25} height={25} src={deleteImg} />
                  <Text ml={5} size={18}>
                  {getLanguageEnumByKeyAndLanguage({ key: "Delete", LanguageId: userLanguage}) }
                  </Text>
                </Button>

                <Box style={{margin: '10px',overflow: 'auto', maxHeight: '62%', scrollbarWidth: 'thin'}}>
                  <Text>{selectedAnnotation.description} </Text>
                </Box>
              </Box>
              
              }
            {isModelClicked && <Box
            style={{position: 'absolute', top: 10, left:  isMediumScreen ? "80px":'6vw', zIndex: 998}}
            > <Text size={30} weight={800}>
              {activeModelTitle}
              </Text> </Box>}
              <Canvas onWheel={handleMouseWheel}
                style={{ width: "100%", height: "100%" }}>
                <OrthographicCamera makeDefault position={[0, 0, 20]} zoom={zoomValue} />
                <Suspense fallback={null}>
                  <ambientLight intensity={1} />
                  <directionalLight position={[1, 5, 1]} intensity={1.5} />
                  <SlicerModel
                    position={[0, -1, 0]}
                    scale={[0.8, 0.8, 0.8]}
                    modelPath={modelPath} 
                    addingAnnotation={addingAnnotation}
                    isSlicing={isSlicing}
                    isResetted = {isResetted}
                    addAnnotation={addAnnotation}
                    changedMeshPositions = {setChangedMesh}
                    savedMeshPositions={ChangedMeshPositions}
                    zoomValue={zoomValue}
                  />
                {isAnnotationMode && annotations.map((point, index) => (
          <group key={index} position={point.position} >
            <mesh>
             <ringGeometry  args={[0.32, 0.38, 34]}  />
              <meshBasicMaterial color="black" />
            </mesh>
            <CustomText 
              position={[0, 0, 0]}
              fontSize={0.32} 
              anchorX="center"
              anchorY="middle"
              fontWeight='bold'
              color='black'
            >
              {index+1}
            </CustomText>
          </group>
        ))}
                </Suspense>
                <OrbitControls
            ref={controlsRef}
                enableZoom={false}
                enablePan={panEnable}
                enableRotate={rotateEnable}
                />
              </Canvas>
              {panNoti&& 
              <Notification onClose={()=>setPanNoti(!panNoti)} color="green" radius="md"  style={{minWidth: '15%', position: 'fixed', 
              top:30, left: '50%', transform: 'translateX(-40%)',}} title={getLanguageEnumByKeyAndLanguage({ key: "Pan_Noti", LanguageId: userLanguage}) }>
      </Notification>}

              {successmessage && 
              <Notification onClose={()=>setSuccessmessage(!successmessage)} color="green" radius="md"  style={{minWidth: '15%', position: 'fixed', 
              top:20, left: '50%', transform: 'translateX(-50%)',}} title={getLanguageEnumByKeyAndLanguage({ key: "Save_Success", LanguageId: userLanguage}) }>
      </Notification>}
      {errorMessage && 
              <Notification onClose={()=>setErrormessage(!errorMessage)} color="red" radius="md"  style={{minWidth: '15%', position: 'fixed', top:20, left: '50%', transform: 'translateX(-50%)',}} title= {getLanguageEnumByKeyAndLanguage({ key: "Error_Occured", LanguageId: userLanguage}) }>
       {getLanguageEnumByKeyAndLanguage({ key: "Save_Error", LanguageId: userLanguage}) }</Notification>}
              <Group {...isMediumScreen ? {justify: 'flex-start'} : {position:"center"}}  style={{width: isMediumScreen? "350px" :'', marginLeft: isMediumScreen? "10px" : 0 , zIndex: 999,  position: 'absolute', bottom:20, left: isMediumScreen?  2 : 0, right: isMediumScreen ?2 : 0 }}>
              {(!addingAnnotation && (annotations.length > 0) && isAnnotationMode )  && <>
      <Group position="center">
      <Select sx={{width: isMediumScreen ? "330px" :''}}
  data={annotations.map((annotation, index) => ({
    value: annotation.id.toString(),
    label: `${index+1} - ${annotation.title}`,
    id: annotation.id.toString()
  }))}
  value={currentpopupannoation?.toString() || ""}
  onChange={(value) => {
    if (value !== null) {
      setcurrentPopUp(parseInt(value));
      const shownannotation = annotations.find(ann => ann.id === parseInt(value));
      if(shownannotation){
        setSelectedAnnotation({id: shownannotation.id, title: shownannotation.title, description:  shownannotation.description});
      }
    }
  }}
  placeholder={getLanguageEnumByKeyAndLanguage({ key: "Select_Annotation", LanguageId: userLanguage}) } searchable />

      </Group >
              </>
              }
                <Box style={{ height: 40, width:isMediumScreen? "330px" : 270  ,backgroundColor: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Slider
                color='indigo'
                  style={{ width:isMediumScreen? "250px" : 200 }}
                  value={zoomValue-50}
                  min={0}
                  max={100}
                  marks={[
                    { 
                      value: 0, 
                      label: <img src={zoomOutImg} width={20} height={20} alt="Zoom Out" style={{ transform: 'translate(-20px, -20px)' }} /> 
                    },
                    { 
                      value: 100, 
                      label: <img src={zoomInImg} width={20} height={20} alt="Zoom In" style={{ transform: 'translate(20px, -20px)' }} /> 
                    }
                  ]}
                  onChange={handleZoomChange} 
                />
                </Box>
                <Button style={{ padding: 0, width: 100, height: 40, borderRadius: '10px',  backgroundColor: rotateEnable? "#4B65F6": 'white'  }}
                onClick={handleRotateButton}
                >
                <Text size='lg' c={rotateEnable ? "white" : "black"}>
                {getLanguageEnumByKeyAndLanguage({ key: "Rotate", LanguageId: userLanguage}) }
                  </Text>
                  <img src={rotateImg}  width={22} height={22} alt="Rotate"
                            style={{ marginLeft: '10px', filter: rotateEnable ? "invert(1)" : "invert(0)" }} />
                </Button>
                <Button style={{ padding: 0, width:  userLanguage=="hi" ? 110 : 100, height: 40, borderRadius: '10px', backgroundColor: panEnable? "#4B65F6": 'white'  }}
                onClick={handlePanButton}
                >
                  <Text size='lg' c={panEnable ? "white" : "black"}>
                  {getLanguageEnumByKeyAndLanguage({ key: "Pan", LanguageId: userLanguage}) }
                  </Text>
                  <img src={panImg}  width={22} height={22}  alt="Pan"
                          style={{ marginLeft: '10px', filter: panEnable ? "invert(1)" : "invert(0)" }} />
                </Button>
                <Button onClick={handleResetButton}  style={{ padding: 0, width: userLanguage=="hi" ? 120 : 100,borderRadius: '10px', height: 40, backgroundColor: 'white' }}>
                  <Text size='lg' c="black">
                  {getLanguageEnumByKeyAndLanguage({ key: "Reset", LanguageId: userLanguage})}
                  </Text>
                  <img src={resetImg} width={22} height={22} style={{marginLeft: '10px'}} alt="Reset" />
                </Button>
                </Group>
                {!issavedSimulation && <>
                <Group style={{ zIndex: 999, position: 'absolute', bottom: 20, right: 0, marginRight: '20px' }} >
                  <Box style={{display: 'flex', flexDirection :'column'}}>
                  <Box style={{display: 'flex', alignItems: 'end'}}>
                    <Box style={{display: 'flex', flexDirection: 'column'}}>
                      {saveBoxVisible && 
                    <Box style={{display: 'flex', flexDirection: 'column', marginBottom: '10px', gap: 10, backgroundColor: 'white', padding: '8px',
                      border: '1px solid white', borderRadius: '10px', cursor: 'pointer'
                    }}>
                      {/* <Box style={{display: 'flex', alignItems: 'center', gap: 2,}} 
                      sx={{'&:hover': {opacity: 0.6},}}
                      ><img src={newfileImg} /> <Text>New File</Text></Box> */}
                      {/* <Box onClick={handleSaveClick} sx={{'&:hover': {opacity: 0.6},}} style={{display: 'flex', alignItems: 'center', gap: 2}}><img src={saveImg} /><Text>Save</Text></Box> */}
                      <Box onClick={handleSaveAsClick} sx={{'&:hover': {opacity: 0.6},}} style={{display: 'flex', alignItems: 'center', gap: 2}}><img src={saveasImg} /><Text>{getLanguageEnumByKeyAndLanguage({ key: "Save_As", LanguageId: userLanguage})}</Text></Box>
                    </Box>
                    }
                    <Button onClick={handleFileClick} style={{ padding: 0, marginRight: 5, width: 100, height: 40, backgroundColor: 'white', color: "black" }}>
                    {getLanguageEnumByKeyAndLanguage({ key: "File", LanguageId: userLanguage})}
                    </Button>
                    </Box>
                    {isAnnotationMode ? 
                    <Button style={{ padding: 0, marginRight: 5, width: 50, height: 40, backgroundColor: !addingAnnotation ? "#4B65F6" : 'white' }}
                    onClick={handleCursorSelection}>
                      <img src={cursorImg} 
                      style={{ filter: !addingAnnotation ? "invert(0)" : "invert(1)" }}/>
                    </Button> : 
                    <Button style={{ padding: 0, marginRight: 5, width: 50, height: 40, backgroundColor: isSlicing ? "#4B65F6" : 'white' }}
                    onClick={handleSliceSelection}>
                      <img src={sliceImg} 
                      style={{ filter: isSlicing ? "invert(1)" : "invert(0)" }}/>
                    </Button>
                    }
                    {isAnnotationMode ?  
                    <Button style={{ padding: 0, width: 50, height: 40, backgroundColor: addingAnnotation ? "#4B65F6" : 'white' }}
                    onClick={handleAnnotationAddingButton}>
                    <img src={addAnnotationImg}  style={{filter: addingAnnotation ? "invert(1)" : 'invert(0)' }}/>
                  </Button> :
                    <Button style={{ padding: 0, width: 50, height: 40, backgroundColor: drawingMode ? "#4B65F6" : 'white' }}
                    onClick={handlePencilclick}>
                      <img src={pencilImg} style={{filter: drawingMode ? "invert(1)" : 'invert(0)'  }}  />
                    </Button> }
                  </Box>

                        <Select itemComponent={SelectItem}
      data={[
        { value: 'object_mode', label: getLanguageEnumByKeyAndLanguage({ key: "Object_Mode", LanguageId: userLanguage}), image: cursorImg },
        { value: 'annotation_mode', label:getLanguageEnumByKeyAndLanguage({ key: "Annotation_Mode", LanguageId: userLanguage}), image: pencilImg },
      ]}
      
      placeholder="Select mode"
      value={isAnnotationMode ? 'annotation_mode' : 'object_mode'} 
      onChange={(value) => handleModeChange(value as string)} 
      style={{ marginTop: '10px' }}
    />

                  </Box>
                </Group></>}
            </>
          }
        </Box>
      );
    }

    export default SlicerModelSimulation;
